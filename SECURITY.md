\# Security Policy



\## Supported Versions



| Version | Supported          |

| ------- | ------------------ |

| v1.0.x  | ✅ Active (Initial Release) |

| < v1.0  | ❌ Not supported   |



\## Reporting a Vulnerability



We take security seriously. If you discover a security vulnerability in KHAWRIZM Sovereign Ecosystem, please report it privately:



1\. \*\*Email\*\*: iqd@hotmail.com + shammar403@gmail.com (preferred)  

&#x20;  أو iqd@hotmail.com + shammar403@gmail.comمع عنوان الموضوع: \[SECURITY] Vulnerability Report



2\. \*\*Details to include\*\*:

&#x20;  - Description of the vulnerability

&#x20;  - Steps to reproduce

&#x20;  - Potential impact

&#x20;  - Suggested fix (if any)

&#x20;  - Affected versions/files



We will acknowledge receipt within 48 hours and aim to provide an update (including patch timeline) within 7 days.



\## Security Overview



\- \*\*Zero Telemetry\*\*: No external tracking or data exfiltration.

\- \*\*Local-First\*\*: All AI inference via Ollama (no cloud calls by default).

\- \*\*Encryption\*\*: AES-256-GCM at rest (planned), TLS 1.3 in transit.

\- \*\*Dependencies\*\*: Regularly updated (Express, Next.js, MariaDB, Ollama).

\- \*\*Compliance Claims\*\*: PDPL (Saudi), NCA-ECC aligned, NIST-inspired.



\## Known Limitations (as of v1.0)



\- No formal third-party audit yet (planned for Enterprise tier).

\- Healthchecks for MariaDB may fail intermittently on first start (see docker logs).

\- API keys/secrets must never be committed (use .env + .gitignore).



\## Preferred Language for Reports



Arabic or English.



Thank you for helping keep KHAWRIZM secure.



Last updated: March 19, 2026

