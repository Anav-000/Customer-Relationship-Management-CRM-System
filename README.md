# 🚀 Supriya CRM System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/stack-MERN-blueviolet)
![Status](https://img.shields.io/badge/status-development-orange)

A customizable multi-tenant **Customer Relationship Management (CRM)** system where **any company can register**, manage their business, and **brand their CRM** with personalized settings, metadata, and visual identity.

---

## 🌟 Features

### 🔐 Company Registration & Branding
- Unique company accounts with independent login credentials
- Upload & manage:
  - Company logo, header logo, and favicon
  - robots.txt
  - Footer and title/description
  - Meta image, meta tags, Open Graph (OG) data

### 💳 Subscription Plan Integration
- MongoDB-based **subscription system**
- Each user has a **unique token** to access CRM features
- Feature access based on plan tier (Basic, Pro, Enterprise)

### 🗃️ Company Info Management
- GSTIN, address, email, phone, and more
- Stored securely in the `tbl_company_info` table
- Company logos stored as BLOBs in the MySQL database

---

## 💼 Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | React / Next.js             |
| Backend      | Node.js, Express.js         |
| Database     | MongoDB (plans) + MySQL (CRM) |
| Styling      | Tailwind / Bootstrap        |
| Auth (optional) | JWT / OAuth / Custom Auth |
| Hosting      | Render / Vercel / Railway   |

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/supriya-crm.git
   cd supriya-crm
