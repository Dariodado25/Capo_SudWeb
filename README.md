# CAPO SUD — caposud.blog

> Il Sudafrica spiegato da chi ci vive.
> Rivista personale / blog di Dario — romano, 19 anni, un anno di servizio civile in Sudafrica.

Sito statico multi-pagina, **zero framework, zero build step**: HTML + CSS + JavaScript vanilla.
Si apre direttamente nel browser (o con qualsiasi static host: GitHub Pages, Netlify, Vercel).

---

## Struttura del progetto

```
├── index.html          Homepage (rivista vintage, tutte le feature)
├── blog.html           Blog con filtri categoria + sidebar
├── itinerari.html      Itinerari con filtri durata/tipo/budget
├── servizi.html        Pricing card (Itinerario €49 / Consulenza €29 / Kit PDF €19) + FAQ
├── chi-sono.html       Bio di Dario + timeline Roma ⇄ Cape Town
├── contatti.html       Contatti (WhatsApp, Telegram, email, social)
├── styles.css          Design system pagine interne (token, nav, footer, card)
├── css/
│   ├── vintage-bridge.css     Allinea le pagine interne allo stile vintage della home
│   └── shared-features.css    Stili delle feature condivise (live badge, rotta, reveal…)
├── js/
│   └── shared.js              Tutte le feature JS condivise (vedi sotto)
└── uploads/            Immagini caricate (logo, Bo-Kaap, Boulders Beach, avatar bot)
```

`index v1.html` / `index v2.html` sono versioni storiche conservate per riferimento.

## Design system

| Token | Valore | Uso |
|---|---|---|
| `--cream` | `#F1E9D8` | Sfondo carta |
| `--ink` | espresso scuro | Testo / superfici scure |
| `--terra` | terracotta | Accento primario |
| `--oxblood` | rosso scuro | Accento forte / timbri |
| `--moss` | verde | Accento natura |
| `--gold` | oro caldo | Dettagli / kicker |

**Tipografia:** Bodoni Moda (titoli display) · Manrope (corpo) · JetBrains Mono (label, meta, kicker).
**Stile:** rivista di viaggio vintage — grana carta, bordi inchiostro, timbri postali, niente blu elettrico né rosso acceso.

## Feature condivise (`js/shared.js`)

Ogni modulo è auto-contenuto: si attiva solo se trova i propri elementi nel DOM.
Sicuro da includere in qualsiasi pagina.

1. **Mobile menu** — burger + slide-in panel
2. **Reveal-on-scroll** — `IntersectionObserver`, auto-tag delle card comuni
3. **Live da Cape Town** — badge fisso con ora SAST (UTC+2) che batte i secondi + attività di Dario in base all'ora; bilingue IT/EN
4. **Rotta di viaggio** — progress-line tratteggiata laterale; spilli generati dai `data-screen-label` delle sezioni
5. **Tilt 3D card** — solo `pointer: fine`, disattivato con `prefers-reduced-motion`
6. **CTA magnetici** — `.btn-primary` segue il cursore (solo desktop)
7. **Contatori animati** — `[data-counter]` con ease-out cubic
8. **Drag-scroll** — `#cardsWrap` trascinabile col mouse (su touch basta lo scroll nativo)

### Solo homepage (inline in `index.html`)
- **Intro documentario** — overlay cinematografico alla prima visita per sessione (`sessionStorage`), skippabile, rispetta `reduced-motion`
- **Slideshow Ken Burns** — 4 foto verificate del Sudafrica
- **Ticker destinazioni** + **stats bar** (1+ anno / 6 mesi / 12+ itinerari)
- **Passaporto timbri** — colleziona 6 timbri-regione scrollando
- **Toggle lingua IT/EN** — traduzione completa client-side, persistita in `localStorage`
- **Assistente Sawubona** — chat widget con risposte predefinite bilingui

## Accessibilità & performance

- `prefers-reduced-motion` rispettato ovunque (animazioni → stato finale)
- `loading="lazy"` su tutte le immagini, `alt` descrittivi
- Font Google con `display=swap` e preconnect
- Feature decorative nascoste su mobile (`route`, `passport`) o degradate a scroll nativo
- Nessuna dipendenza JS esterna

## Placeholder da sostituire prima del lancio

Cerca `<!-- TODO` nei file. In sintesi:

| Cosa | Dove | Sostituire con |
|---|---|---|
| Link Calendly | servizi, blog (sidebar) | URL Calendly reale |
| Numero WhatsApp | contatti, servizi | numero reale |
| Bot Telegram | home, blog, contatti | `t.me/CapoSudBot` reale |
| Form newsletter | home | endpoint Mailchimp/ConvertKit |
| Foto di Dario | chi-sono, home | foto reali |
| Social link | footer (tutte) | profili Instagram/TikTok/Facebook/Telegram |
| Pagine articolo | blog (tutti i "Leggi →" sono `#`) | template articolo singolo (fase 3) |
| Toggle IT/EN | solo su index.html | propagare alle pagine interne o dichiarare il limite |

## Deploy

Nessun build: carica i file così come sono su qualsiasi static host.
Consigliato: dominio `caposud.blog`, HTTPS automatico (Netlify/Vercel/Pages lo danno gratis).
