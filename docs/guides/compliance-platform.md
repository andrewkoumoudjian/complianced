# Compliance Platform Blueprint

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [User Interface Guidelines](#user-interface-guidelines)
- [Carbon Components Mapping](#carbon-components-mapping)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

This document outlines a high-level blueprint for building an AI-driven compliance management platform for investment advisors in Quebec. It follows the guidance in `GUIDE.MD` and IBM's Carbon Design System. The goal is to provide account verification, trade review and document management features with a consistent, bilingual UI.

## Core Features

1. **Account Opening & KYC/KYP**
   - Guided onboarding wizard for identity verification and disclosure delivery.
   - Automated reminders for incomplete verification within CIRO’s 30-day rule.
2. **Trade Review & Audit Trails**
   - Daily trade blotter with flagging for out-of-profile orders.
   - Supervisor approval workflow with immutable logs of comments and status.
3. **Document Management**
   - Standardized folder structure per client (Profile, Agreements, Trades, Notes).
   - File upload with OCR tagging and retention policy automation.
4. **Risk Profile Questionnaire**
   - Questionnaire builder with scoring logic.
   - Highlights inconsistent answers before submission.

## User Interface Guidelines

- **Color palette**: IBM Blue `#0F62FE` for primary actions, Carbon Gray `#393939` for UI chrome, `#F4F4F4` backgrounds, `#161616` text, `#24A148` success, `#F1C21B` warning, `#DA1E28` error.
- **Typography**: IBM Plex Sans / Mono. Follow the 16px grid for spacing (16/24/32).
- **Layout**: Layered card approach with responsive data tables and forms.
- **Accessibility**: All components must meet WCAG AA. Provide ARIA labels for custom steps.

## Carbon Components Mapping

| Feature | Suggested Components |
|---------|---------------------|
| Account wizard | `ProgressIndicator`, `Form`, `Tabs` |
| KYC forms | `TextInput`, `Select`, `NumberInput`, `DatePicker` |
| Risk questionnaire | `RadioButtonGroup`, `Slider`, `DataTable` (summary) |
| Trade blotter | `DataTable`, `Tag`, `OverflowMenu` |
| Document vault | `FileUploader`, `DataTable` |
| Compliance dashboard | `Tile`, `Tabs`, `@carbon/charts-react` |
| Notifications | `ToastNotification`, `InlineNotification` |

