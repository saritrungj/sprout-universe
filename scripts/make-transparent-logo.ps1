param(
  [string] $Source = "C:\Users\suth-admin\Downloads\ChatGPT Image Jun 19, 2026, 09_52_18 AM.png",
  [string] $Dest = "D:\github-clone\sprout-planner\public\sprout-mascot.png",
  [int] $InteriorClearArea = 4500
)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class TransparentLogo
{
    public static void Convert(string source, string dest, int interiorClearArea)
    {
        using (var input = new Bitmap(source))
        using (var bitmap = new Bitmap(input.Width, input.Height, PixelFormat.Format32bppArgb))
        using (var g = Graphics.FromImage(bitmap))
        {
            g.DrawImage(input, 0, 0, input.Width, input.Height);
            int width = bitmap.Width;
            int height = bitmap.Height;
            var rect = new Rectangle(0, 0, width, height);
            var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int stride = data.Stride;
            int bytes = Math.Abs(stride) * height;
            byte[] pixels = new byte[bytes];
            Marshal.Copy(data.Scan0, pixels, 0, bytes);

            bool[] visited = new bool[width * height];
            var queue = new Queue<int>(width * 2 + height * 2);

            Action<int, int> add = (x, y) =>
            {
                if (x < 0 || x >= width || y < 0 || y >= height) return;
                int index = y * width + x;
                if (visited[index]) return;
                int offset = y * stride + x * 4;
                byte b = pixels[offset];
                byte gch = pixels[offset + 1];
                byte r = pixels[offset + 2];
                int max = Math.Max(r, Math.Max(gch, b));
                int min = Math.Min(r, Math.Min(gch, b));
                bool brightNeutral = max - min <= 16 && min >= 220;
                bool almostWhite = r >= 246 && gch >= 246 && b >= 246;
                if (!brightNeutral && !almostWhite) return;
                visited[index] = true;
                queue.Enqueue(index);
            };

            for (int x = 0; x < width; x++)
            {
                add(x, 0);
                add(x, height - 1);
            }

            for (int y = 0; y < height; y++)
            {
                add(0, y);
                add(width - 1, y);
            }

            while (queue.Count > 0)
            {
                int index = queue.Dequeue();
                int x = index % width;
                int y = index / width;
                add(x + 1, y);
                add(x - 1, y);
                add(x, y + 1);
                add(x, y - 1);
            }

            if (interiorClearArea > 0)
            {
                bool[] scanned = new bool[width * height];
                var component = new List<int>();
                var componentQueue = new Queue<int>();
                Func<int, bool> neutralAt = (index) =>
                {
                    int x = index % width;
                    int y = index / width;
                    int offset = y * stride + x * 4;
                    byte b = pixels[offset];
                    byte gch = pixels[offset + 1];
                    byte r = pixels[offset + 2];
                    int max = Math.Max(r, Math.Max(gch, b));
                    int min = Math.Min(r, Math.Min(gch, b));
                    return (max - min <= 16 && min >= 220) || (r >= 246 && gch >= 246 && b >= 246);
                };

                for (int start = 0; start < visited.Length; start++)
                {
                    if (visited[start] || scanned[start] || !neutralAt(start)) continue;
                    component.Clear();
                    scanned[start] = true;
                    componentQueue.Enqueue(start);

                    while (componentQueue.Count > 0)
                    {
                        int index = componentQueue.Dequeue();
                        component.Add(index);
                        int x = index % width;
                        int y = index / width;
                        int[] neighbors = new int[] { index - 1, index + 1, index - width, index + width };
                        foreach (int next in neighbors)
                        {
                            if (next < 0 || next >= visited.Length || scanned[next] || visited[next]) continue;
                            int nx = next % width;
                            int ny = next / width;
                            if (Math.Abs(nx - x) + Math.Abs(ny - y) != 1) continue;
                            if (!neutralAt(next)) continue;
                            scanned[next] = true;
                            componentQueue.Enqueue(next);
                        }
                    }

                    if (component.Count >= interiorClearArea)
                    {
                        foreach (int index in component)
                        {
                            visited[index] = true;
                        }
                    }
                }
            }

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    if (!visited[y * width + x]) continue;
                    int offset = y * stride + x * 4;
                    pixels[offset] = 255;
                    pixels[offset + 1] = 255;
                    pixels[offset + 2] = 255;
                    pixels[offset + 3] = 0;
                }
            }

            Marshal.Copy(pixels, 0, data.Scan0, bytes);
            bitmap.UnlockBits(data);
            bitmap.Save(dest, ImageFormat.Png);
        }
    }
}
"@

[TransparentLogo]::Convert($Source, $Dest, $InteriorClearArea)
