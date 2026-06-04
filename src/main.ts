import "./style.css";

const form = document.querySelector<HTMLFormElement>("#form")!;
const result = document.querySelector<HTMLFieldSetElement>("#result")!;
const clipboard = document.querySelector<HTMLFormElement>("#clipboard")!;
const field = document.querySelector<HTMLInputElement>("#password")!;

function getCharacters({
  withSpecialCharacters,
  withUppercaseLetters,
  withLowercaseLetters,
  withNumbers,
}: {
  withSpecialCharacters: boolean;
  withUppercaseLetters: boolean;
  withLowercaseLetters: boolean;
  withNumbers: boolean;
}): string {
  const characters: string[] = [];

  const anyOptionSelected =
    withSpecialCharacters ||
    withUppercaseLetters ||
    withLowercaseLetters ||
    withNumbers;

  if (withSpecialCharacters || !anyOptionSelected) {
    characters.push("`!#$%&'()*+,-./{|}~");
  }

  if (withUppercaseLetters || !anyOptionSelected) {
    characters.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }

  if (withLowercaseLetters || !anyOptionSelected) {
    characters.push("abcdefghijklmnopqrstuvwxyz");
  }

  if (withNumbers || !anyOptionSelected) {
    characters.push("0123456789");
  }

  return characters.join("");
}

function generatePassword({
  length,
  characters,
}: {
  length: number;
  characters: string;
}): string {
  let password = "";

  for (let i = 0; i < length; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }

  return password;
}

function setField(value: string, disabled: boolean) {
  result.disabled = disabled;
  field.value = value;
}

function handleSubmit(form: HTMLFormElement) {
  const values = new FormData(form);

  const boolean = (value: FormDataEntryValue | null) => Boolean(value) || false;
  const number = (value: FormDataEntryValue | null) => Number(value) || 0;

  const withSpecialCharacters = boolean(values.get("withSpecialCharacters"));
  const withUppercaseLetters = boolean(values.get("withUppercaseLetters"));
  const withLowercaseLetters = boolean(values.get("withLowercaseLetters"));
  const withNumbers = boolean(values.get("withNumbers"));
  const length = number(values.get("length")) || 36;

  const characters = getCharacters({
    withLowercaseLetters,
    withNumbers,
    withSpecialCharacters,
    withUppercaseLetters,
  });

  const password = generatePassword({ length, characters });

  setField(password, false);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSubmit(form);
});

clipboard.addEventListener("submit", async (event) => {
  event.preventDefault();
  await navigator.clipboard.writeText(field.value);
  alert("Copied to clipboard");
});

form.addEventListener("reset", () => setField("", true));
