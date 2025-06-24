import requests
from bs4 import BeautifulSoup

def crawl_page(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Only return text inside the main content (strip menus, footers)
        for tag in soup(['script', 'style', 'nav', 'footer']):
            tag.decompose()

        text = soup.get_text(separator=' ')
        cleaned = ' '.join(text.split())[:4000]  # Limit to 4000 characters
        return cleaned
    except Exception as e:
        return f"Failed to load page: {e}"

if __name__ == "__main__":
    url = "https://graduate.gsu.edu/degree-programs/"
    text = crawl_page(url)
    print("---- CRAWLED TEXT PREVIEW ----")
    print(text[:1500])  # Show first 1500 chars of crawled content
