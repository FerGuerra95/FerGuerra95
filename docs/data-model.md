# Modelo de Datos

## Entidades comunes
### User
- id
- name
- email
- role
- organizationId
- createdAt

### Organization
- id
- name
- plan
- createdAt

### File
- id
- organizationId
- ownerId
- module
- filename
- mimeType
- storagePath
- createdAt

## M&A
### Case
- id
- organizationId
- name
- sector
- status
- createdAt
- updatedAt

### Valuation
- id
- caseId
- normalizedEbitda
- netDebt
- equityBase
- adjustedMultiple
- qualityScore
- createdAt

### BuyerMatch
- id
- caseId
- buyerType
- title
- fitScore
- description

### Report
- id
- caseId
- type
- version
- htmlPath
- pdfPath
- createdAt

## Compliance
### Supplier
- id
- organizationId
- name
- country
- sector
- tier
- status
- createdAt
- updatedAt

### SupplierSite
- id
- supplierId
- country
- region
- city
- address
- latitude
- longitude

### Alert
- id
- supplierId
- type
- severity
- title
- status
- sourceCount
- detectedAt

### Evidence
- id
- supplierId
- alertId
- sourceType
- sourceUrl
- sourceLanguage
- translatedLanguage
- excerpt
- screenshotPath
- createdAt

### Citation
- id
- evidenceId
- label
- url
- snippet
- language

### ReviewDecision
- id
- alertId
- reviewerId
- decision
- note
- decidedAt

### ComplianceReport
- id
- supplierId
- version
- status
- htmlPath
- pdfPath
- createdAt
