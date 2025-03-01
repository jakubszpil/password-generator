import "./style.css";

const form = document.querySelector<HTMLFormElement>("#form")!;
const result = document.querySelector<HTMLFieldSetElement>("#result")!;
const clipboard = document.querySelector<HTMLFormElement>("#clipboard")!;
const field = document.querySelector<HTMLInputElement>("#password")!;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generatePassword(form);
});

clipboard.addEventListener("submit", async (event) => {
  event.preventDefault();
  await navigator.clipboard.writeText(field.value);
  alert(`
    Copied to clipboard: \r
    ${field.value}  
  `);
});

form.addEventListener("reset", () => {
  result.disabled = true;
  field.value = "";
});

function generatePassword(form: HTMLFormElement) {
  const values = new FormData(form);

  const boolean = (value: FormDataEntryValue | null) => Boolean(value) || false;
  const number = (value: FormDataEntryValue | null) => Number(value) || 0;

  const withSpecialCharacters = boolean(values.get("withSpecialCharacters"));
  const withUppercaseLetters = boolean(values.get("withUppercaseLetters"));
  const withLowercaseLetters = boolean(values.get("withLowercaseLetters"));
  const withNumbers = boolean(values.get("withNumbers"));
  const length = number(values.get("length"));

  const validLength = length || 36;

  let characters: string = "";
  const anyOptionSelected =
    withSpecialCharacters ||
    withUppercaseLetters ||
    withLowercaseLetters ||
    withNumbers;

  if (withSpecialCharacters || !anyOptionSelected) {
    characters += "`!#$%&'()*+,-./{|}~";
  }

  if (withUppercaseLetters || !anyOptionSelected) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (withLowercaseLetters || !anyOptionSelected) {
    characters += "abcdefghijklmnopqrstuvwxyz";
  }

  if (withNumbers || !anyOptionSelected) {
    characters += "0123456789";
  }

  let password = "";

  for (let i = 0; i < validLength; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }

  field.value = password;
  result.disabled = false;
}
