```markdown
# Password Validation Challenge – React Implementation

## Overview
This project implements a **Create User** form in React with both client-side and server-side password validation. It connects to the HENNGE Password Validation Challenge API and enforces strong security rules for credential creation.

---

## Project Structure
```

src/
├── app.tsx                 # Main app component with success state
├── create-user-form.tsx    # Form component (main implementation)
├── main.tsx                # Entry point
├── style.css               # Global styles
└── vite-env.d.ts           # Vite environment types

````

---

## Features

### 1. Client-Side Password Validation
The password is validated dynamically as the user types. The rules are:

- Minimum 10 characters  
- Maximum 24 characters  
- No spaces  
- At least one number  
- At least one uppercase letter  
- At least one lowercase letter  

Validation messages only appear after the user tries to submit the form.

### 2. API Integration
- **Base URL:** `https://api.challenge.hennge.com/password-validation-challenge-api/001`  
- **Endpoint:** `/challenge-signup`  
- **Method:** `POST`  
- **Authentication:** Bearer token (`Authorization: Bearer <token>`)

### 3. Error Handling
The form displays exact messages depending on the API response:

| Status | Message |
|--------|---------|
| 401 / 403 | Not authenticated to access this resource. |
| 500 | Something went wrong, please try again. |
| 400 (password banned) | Sorry, the entered password is not allowed, please try a different one. |
| Other | Something went wrong, please try again. |

### 4. Success State
On successful user creation, `app.tsx` shows:

**User was successfully created!**

### 5. Accessibility
The form follows accessibility best practices using:

- `aria-required="true"`
- `aria-invalid` applied only after validation fails
- `aria-errormessage` linking fields to specific messages
- `role="alert"` on error containers
- `noValidate` on the form to disable native HTML5 checks

### 6. User Experience
The form prevents submission when:

- Username is blank  
- Password fails any rule  

Additional UX improvements:

- Errors clear when inputs change  
- Loading state blocks multiple submissions  
- API errors are visually separated from validation errors  

---

## Setup Instructions

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation
```sh
npm install
````

### Start Development Server

```sh
npm run dev
```

Open the browser at the address shown in your terminal (commonly `http://localhost:5173`).

---

## Configuration

### API Token

Update the token in `create-user-form.tsx`:

```ts
const AUTH_TOKEN = "your_actual_token_here";
```

### Payload Format

The form posts the following JSON:

```json
{
  "username": "user@example.com",
  "password": "ValidPass123"
}
```

---

## Code Structure

### CreateUserForm Component

This component manages:

**State**

* `username`, `password`
* `clientErrors` for validation issues
* `apiError` for server responses
* `loading`
* `submitted`

**Validation**

* `validatePassword()` checks all rules and returns failed criteria

**Event Handlers**

* `handleUsernameChange()`
* `handlePasswordChange()`
* `handleSubmit()` sends the request, processes responses, and updates UI

### Error Display

* Validation errors appear in a `<ul>` under the password input
* API errors appear in a separate `<div>` under both inputs
* Username error appears under the username field

---

## Styling

Inline style objects at the bottom of `create-user-form.tsx` define:

* `formWrapper`
* `form`
* `formInput`
* `formButton`

Errors use inline styling as well. No external styling libraries or modified CSS classes.

---

## Notes

* Only React is used, no extra dependencies
* All error messages follow the exact wording required
* Accessibility follows WCAG recommendations

---

## Install Dependencies

```
npm install
```

```
```
