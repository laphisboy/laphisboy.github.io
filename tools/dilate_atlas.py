"""Fill the UV gutter of a GLB's baked textures so filtering cannot bleed one
island's colour into its neighbour. Rebuilds the GLB with fresh offsets.

  c3g/bin/python tools/dilate_atlas.py public/mesh/portrait.glb [--strip-mr]
"""
import json, struct, io, sys, os
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import distance_transform_edt

PAD = 12

def read_glb(path):
    d = open(path, 'rb').read()
    clen, = struct.unpack_from('<I', d, 12)
    j = json.loads(d[20:20 + clen])
    boff = 20 + clen
    blen, = struct.unpack_from('<I', d, boff)
    return j, d[boff + 8: boff + 8 + blen]

def accessor(j, buf, idx):
    a = j['accessors'][idx]; bv = j['bufferViews'][a['bufferView']]
    ctype = {5121: np.uint8, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}[a['componentType']]
    ncomp = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    return np.frombuffer(buf, dtype=ctype, count=a['count'] * ncomp, offset=off).reshape(a['count'], ncomp)

def coverage(uv, tris, size):
    img = Image.new('L', (size, size), 0)
    dr = ImageDraw.Draw(img)
    px = uv.astype(np.float64).copy()
    px[:, 0] *= size
    px[:, 1] = (1.0 - px[:, 1]) * size
    for a, b, c in tris:
        dr.polygon([tuple(px[a]), tuple(px[b]), tuple(px[c])], fill=255)
    return np.array(img) > 0

def dilate(rgba, mask, pad):
    dist, (iy, ix) = distance_transform_edt(~mask, return_indices=True)
    out = rgba.copy()
    grow = (~mask) & (dist <= pad)
    out[grow] = rgba[iy, ix][grow]
    return out

def write_glb(path, j, views):
    """views: list of bytes, one per bufferView, in index order."""
    blob = bytearray()
    for i, v in enumerate(views):
        while len(blob) % 4:
            blob.append(0)
        j['bufferViews'][i]['byteOffset'] = len(blob)
        j['bufferViews'][i]['byteLength'] = len(v)
        blob += v
    while len(blob) % 4:
        blob.append(0)
    j['buffers'] = [{'byteLength': len(blob)}]

    js = json.dumps(j, separators=(',', ':')).encode()
    js += b' ' * ((4 - len(js) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(blob)
    with open(path, 'wb') as f:
        f.write(struct.pack('<4sII', b'glTF', 2, total))
        f.write(struct.pack('<I4s', len(js), b'JSON')); f.write(js)
        f.write(struct.pack('<I4s', len(blob), b'BIN\x00')); f.write(bytes(blob))

def main(path, strip_mr=False, do_dilate=True):
    j, buf = read_glb(path)
    prim = j['meshes'][0]['primitives'][0]
    uv = accessor(j, buf, prim['attributes']['TEXCOORD_0'])
    tris = accessor(j, buf, prim['indices']).reshape(-1, 3)

    views = []
    for i, bv in enumerate(j['bufferViews']):
        o = bv.get('byteOffset', 0)
        views.append(buf[o:o + bv['byteLength']])

    mr_img = None
    if strip_mr:
        mr = j['materials'][0]['pbrMetallicRoughness'].pop('metallicRoughnessTexture', None)
        if mr is not None:
            mr_img = j['textures'][mr['index']]['source']

    for i, im in enumerate(j['images']):
        if i == mr_img:
            views[im['bufferView']] = b''
            print(f"  {im.get('name'):26s} stripped")
            continue
        if not do_dilate:
            print(f"  {im.get('name'):26s} kept as-is")
            continue
        pil = Image.open(io.BytesIO(views[im['bufferView']])).convert('RGBA')
        mask = coverage(uv, tris, pil.size[0])
        enc = io.BytesIO()
        Image.fromarray(dilate(np.array(pil), mask, PAD)).save(enc, format='PNG', optimize=True)
        before, after = len(views[im['bufferView']]), len(enc.getvalue())
        views[im['bufferView']] = enc.getvalue()
        print(f"  {im.get('name'):26s} {pil.size[0]}px covered={100*mask.mean():4.1f}%  "
              f"{before/1e6:.1f} -> {after/1e6:.1f} MB")

    write_glb(path, j, views)
    print(f"  wrote {os.path.getsize(path)/1e6:.1f} MB")

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    strip = '--strip-mr' in sys.argv
    for p in args:
        print(p); main(p, strip, '--no-dilate' not in sys.argv)
