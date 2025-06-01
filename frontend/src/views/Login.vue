<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <div class="bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <!-- Logo y Título -->
        <div class="text-center">
          <img class="mx-auto h-12 w-auto" :src="logo" alt="Logo" />
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Bienvenido de nuevo
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <!-- Formulario -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Usuario -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <div class="mt-1 relative">
              <input
                v-model="username"
                id="username"
                name="username"
                type="text"
                required
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400',
                  errors.username
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
                ]"
                placeholder="Tu nombre de usuario"
                @blur="validateUsername"
              />
              <!-- Icono de error -->
              <div
                v-if="errors.username"
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p v-if="errors.username" class="mt-2 text-sm text-red-600">
              {{ errors.username }}
            </p>
          </div>

          <!-- Contraseña -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div class="mt-1 relative">
              <input
                v-model="password"
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :class="[
                  'appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400',
                  errors.password
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
                ]"
                placeholder="••••••••"
                @blur="validatePassword"
              />
              <!-- Botón mostrar/ocultar contraseña -->
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePassword"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Recordarme y Olvidé contraseña -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-primary-600 hover:text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <!-- Botón de inicio de sesión -->
          <div>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? "Iniciando sesión..." : "Iniciar Sesión" }}
            </button>
          </div>
        </form>

        <!-- Mensaje de error general -->
        <div v-if="generalError" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                {{ generalError }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore"
import logo from "../assets/logo.png";
const router = useRouter();
const authStore = useAuthStore()
const username = ref('tutor1')
const password = ref("password123");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const generalError = ref("");
const errors = ref({
  username: '',
  password: ''
})


// Validaciones
const validateUsername = () => {
  if (!username.value) {
    errors.value.username = 'El nombre de usuario es requerido'
  } else {
    errors.value.username = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = "La contraseña es requerida";
  } else if (password.value.length < 6) {
    errors.value.password = "La contraseña debe tener al menos 6 caracteres";
  } else {
    errors.value.password = "";
  }
};

const isFormValid = computed(() => {
  return (
    username.value &&
    password.value &&
    !errors.value.username &&
    !errors.value.password
  );
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  validateUsername();
  validatePassword();

  if (errors.value.username || errors.value.password) return;

  isLoading.value = true;
  generalError.value = "";

  try {
    const response = await authService.login(username.value, password.value);

    // Guarda el token y redirige
    authStore.setUserData(response.token, response.user)
    localStorage.setItem("token", response.token);
    router.push("/dashboard"); // Ajusta la ruta si es necesario
  } catch (error) {
    generalError.value = error.message || "Error al iniciar sesión";
  } finally {
    isLoading.value = false;
  }
};
</script>
