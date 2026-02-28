import urllib.request
try:
    url = "https://cura-ai-32.vercel.app/sitemap.xml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'})
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.status)
        print("Headers:")
        for k, v in response.headers.items():
            print(f"  {k}: {v}")
        content = response.read().decode('utf-8')
        print("Content Head:", content[:100])
except Exception as e:
    print("Error:", e)
