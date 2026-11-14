# Klima postupy

Mobilní PWA s postupy nastavení klimatizací podle výrobce (mazání adres, přidání jednotek do systému…) pro Vladana a kolegy.

## Zadání
- Kdo: Vladan a kolegové; všichni s přístupem `klima` smí postupy číst **i upravovat**.
- Kde běží: GitHub Pages (repo VM73/Klima) + sdílený Supabase projekt.
- Hotovo když: kolega se přihlásí, najde výrobce → postup, umí postup upravit a přidat nový, i nadiktovat.

## Stack a nasazení
- `index.html` (vše v jednom), `sw.js` (cache `klima-vN`), `manifest.webmanifest`, ikony `icon-180.png`, `icon-512.png`.
- Supabase JS z cdn.jsdelivr.net, Publishable key v `index.html`. **Nikdy** secret / service_role klíč.
- Edge Functions: `servis?akce=prepis&pole=text` (přepis diktátu, sdílí se se Servisem) a `klima?akce=rozdel` (rozdělení textu na kroky postupu).
- Nasazení: soubory do kořene repa → GitHub Pages; zvýšit `VERZE` v `index.html` i `CACHE` v `sw.js`.

## Sdílený Supabase projekt
- Projekt `pqehuuamgecmdmrdhmza` sdílí Servis (VM73/Servis), Klima a Kuchařka.
- Přístup podle `profily.aplikace` (`klima`). Uživatel jen s `klima` **nesmí** vidět servisní záznamy – RLS kontroluje appku, ne jen `aktivni`.
- Tabulky: `klima_vyrobci`, `klima_postupy` (politika ALL pro uživatele s přístupem `klima` – záměr, kolegové editují).

## Data
- Výrobce → postupy. Postup: název, kroky/text, výrobce.

## Pravidla
- **Dopad na náklady a limity:** u každé úpravy předem zvážit a v souhrnu oznámit dopad na Claude (tokeny), GitHub (Actions minuty, Pages), Supabase (DB, Storage, Edge Functions – free tier), OpenAI/Anthropic API (cena za volání). Když se nic nemění, napsat „bez dopadu“.
- Nejjednodušší řešení, měnit jen nutné; cílené záměny v `index.html`.
- UI česky, iOS vzhled, od 320 px, iPhone i Android.
- Diagnostika: `?debug=1`, viditelné číslo verze.
- Ikony: rodina pracovních appek, přechod #4a8fd4 → #2c5f94, bílý symbol (motiv DIP přepínače).

## Testy
- Playwright: iPhone 13, Pixel 7, 320 / 390 px; celá sada po každé změně.
- RLS ověřit uživatelem jen s `klima` (nesmí vidět `zaznamy` ze Servisu).

## Stav
- Verze 1.

## Supabase
- Schéma (tabulky, RLS) a kód Edge Functions `klima` i `servis` jsou zálohované v repu **VM73/Servis** ve složce `supabase/` (sdílený projekt má jednu zálohu).

- Edge Function `klima` pustí jen schválený účet s přístupem `klima` (`klima_smi()`); přepis diktátu přes `servis?akce=prepis` vyžaduje `servis` nebo `klima`.
- README je prázdné.

## Neměnit
- Sdílené Supabase URL a Publishable key; Edge Function `servis` (používá ji i appka Servis).
