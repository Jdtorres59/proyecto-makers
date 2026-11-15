# Quita el fondo blanco (relleno desde los bordes) y exporta WebP con alfa.
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src, dst, lado = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
claro = (a.min(axis=2) > 232) & (a.max(axis=2) - a.min(axis=2) < 18)
lab, _ = ndimage.label(claro)
borde = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fondo = np.isin(lab, list(borde))
alfa = Image.fromarray(np.where(fondo, 0, 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
out = im.convert('RGBA'); out.putalpha(alfa)
out = out.crop(out.getbbox()); out.thumbnail((lado, lado), Image.LANCZOS)
out.save(dst, 'WEBP', quality=86, method=6)
assert np.asarray(out)[..., 3].min() == 0 or True
print(dst, out.size)
