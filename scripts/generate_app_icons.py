import os
from PIL import Image, ImageDraw

import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
source_img_path = root / 'assets' / 'app-icon-source.png'
fallback_source = pathlib.Path(
    '/home/skjuve/.gemini/antigravity-ide/brain/6d949eba-1884-4494-b304-737fe53bd27a/spotify_app_icon_1780219308399.png'
)
if not source_img_path.exists() and fallback_source.exists():
    source_img_path = fallback_source

res_dir = root / 'android' / 'app' / 'src' / 'main' / 'res'

resolutions = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

if not source_img_path.exists():
    print(f"Error: source image not found at {source_img_path}")
    exit(1)

img = Image.open(source_img_path).convert("RGBA")

for folder, size in resolutions.items():
    folder_path = res_dir / folder
    folder_path.mkdir(parents=True, exist_ok=True)

    # 1. Generate regular ic_launcher.png (resized with antialiasing)
    resized_square = img.resize((size, size), Image.Resampling.LANCZOS)
    square_path = folder_path / 'ic_launcher.png'
    resized_square.save(square_path, "PNG")
    print(f"Generated: {square_path} ({size}x{size})")

    # 2. Generate circular ic_launcher_round.png (using circular alpha mask)
    # Start with a clean transparent mask at the same size
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    # Draw a filled circle inside the bounds
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    
    # Create the round icon by putting the square icon onto the mask
    round_img = Image.new("RGBA", (size, size))
    round_img.paste(resized_square, (0, 0), mask=mask)
    
    round_path = folder_path / 'ic_launcher_round.png'
    round_img.save(round_path, "PNG")
    print(f"Generated: {round_path} ({size}x{size})")

print("All Android app icons updated successfully!")
