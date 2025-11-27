<script setup lang="ts">
import { ref, computed } from 'vue';

type setUserWasCreated = (value: boolean) => void;

interface Props {
  setUserWasCreated: setUserWasCreated;
}

defineProps<Props>();

const API_URL = "https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicWFzaW0ucnNsNzg2QGdtYWlsLmNvbSJdLCJpc3MiOiJoZW5uZ2UtYWRtaXNzaW9uLWNoYWxsZW5nZSIsInN1YiI6ImNoYWxsZW5nZSJ9.4W8pjxzBNUHcuHgEYpBMVLh44bYEYesjchvl2qqAV-k";

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 10)
    errors.push("Password must be at least 10 characters long");
  if (password.length > 24)
    errors.push("Password must be at most 24 characters long");
  if (/\s/.test(password))
    errors.push("Password cannot contain spaces");
  if (!/[0-9]/.test(password))
    errors.push("Password must contain at least one number");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password))
    errors.push("Password must contain at least one lowercase letter");
  return errors;
}

const username = ref("");
const password = ref("");
const clientErrors = ref<string[]>([]);
const apiError = ref<string | null>(null);
const loading = ref(false);
const submitted = ref(false);

const usernameErrorId = "username-error";
const passwordErrorId = "password-error";
const apiErrorId = "api-error";

const usernameInvalid = computed(() => submitted.value && !username.value);
const passwordInvalid = computed(() => submitted.value && clientErrors.value.length > 0);

const handlePasswordChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  password.value = target.value;
  clientErrors.value = validatePassword(target.value);
  apiError.value = null;
  submitted.value = false;
};

const handleUsernameChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  username.value = target.value;
  apiError.value = null;
  submitted.value = false;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  apiError.value = null;
  submitted.value = true;

  const errors = validatePassword(password.value);
  clientErrors.value = errors;

  if (!username.value || errors.length > 0) return;

  loading.value = true;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    if (res.status === 401 || res.status === 403) {
      apiError.value = "Not authenticated to access this resource.";
    } else if (res.status === 500) {
      apiError.value = "Something went wrong, please try again.";
    } else if (res.status === 400) {
      const data = await res.json();
      if (
        data?.error &&
        data.error.toLowerCase().includes("password not allowed")
      ) {
        apiError.value = "Sorry, the entered password is not allowed, please try a different one.";
      } else {
        apiError.value = "Something went wrong, please try again.";
      }
    } else if (res.ok) {
      defineProps<Props>().setUserWasCreated(true);
    } else {
      apiError.value = "Something went wrong, please try again.";
    }
  } catch {
    apiError.value = "Something went wrong, please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="form-wrapper">
    <form @submit="handleSubmit" class="form" novalidate>
      <div>
        <label for="username-input">
          Username
          <input
            id="username-input"
            type="text"
            :value="username"
            @input="handleUsernameChange"
            :disabled="loading"
            aria-required="true"
            :aria-invalid="usernameInvalid ? 'true' : 'false'"
            :aria-errormessage="usernameInvalid ? usernameErrorId : undefined"
          />
        </label>
        <div
          v-if="usernameInvalid"
          :id="usernameErrorId"
          class="form-errors"
          role="alert"
        >
          Please enter a username.
        </div>
      </div>

      <div>
        <label for="password-input">
          Password
          <input
            id="password-input"
            type="password"
            :value="password"
            @input="handlePasswordChange"
            :disabled="loading"
            aria-required="true"
            :aria-invalid="passwordInvalid ? 'true' : 'false'"
            :aria-errormessage="passwordInvalid ? passwordErrorId : undefined"
          />
        </label>
        <ul
          v-if="passwordInvalid"
          :id="passwordErrorId"
          class="form-errors"
          role="alert"
        >
          <li v-for="err in clientErrors" :key="err">{{ err }}</li>
        </ul>
      </div>

      <div v-if="apiError" :id="apiErrorId" class="api-error" role="alert">
        {{ apiError }}
      </div>

      <button type="submit" :disabled="loading" class="submit-button">
        Create User
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 500px;
  width: 80%;
  background-color: #efeef5;
  padding: 24px;
  margin: auto;
  border-radius: 8px;
}

.form {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

label {
  font-weight: 700;
}

input {
  outline: none;
  padding: 8px 16px;
  height: 40px;
  font-size: 14px;
  background-color: #f8f7fa;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.form-errors {
  color: red;
  margin-top: 4px;
  padding-left: 20px;
}

.api-error {
  color: red;
  margin-top: 8px;
}

.submit-button {
  outline: none;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #7135d2;
  color: white;
  font-size: 16px;
  font-weight: 500;
  height: 40px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  align-self: flex-end;
  cursor: pointer;
}

input:disabled,
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
