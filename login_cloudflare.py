from playwright.sync_api import sync_playwright

EMAIL = "abc@gmail.com"
PASSWORD = "12345678"


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto("https://dash.cloudflare.com/login", wait_until="domcontentloaded")

        page.fill('input[name="email"]', EMAIL)
        page.fill('input[name="password"]', PASSWORD)
        page.click('button[type="submit"]')

        # Keep the browser open for any additional steps (e.g., MFA).
        page.wait_for_timeout(15000)
        browser.close()


if __name__ == "__main__":
    main()
