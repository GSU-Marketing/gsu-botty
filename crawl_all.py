import csv
import json
from crawler import crawl_page

csv_file = "GSU_Grad_DQ.csv"
output_file = "cached_pages.json"
all_data = {}

with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        url = row.get("url", "").strip()
        if url and url.startswith("http"):
            print(f"[{i+1}] Crawling: {url}")
            text = crawl_page(url)
            if "Just a moment" not in text and len(text) > 100:
                all_data[url] = text
            else:
                print(f"⚠️ Skipped {url} (probably blocked or empty)")
        else:
            print(f"⛔ Skipped row {i+1} — no valid URL")

with open(output_file, "w", encoding='utf-8') as out:
    json.dump(all_data, out)

print(f"\n✅ Done. Cached {len(all_data)} pages to {output_file}")
