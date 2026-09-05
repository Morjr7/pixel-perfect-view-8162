export type LocalUser = {
  username: string;
  passwordHash: string;
  birthDate: string;
  bestFriendHash: string;
  firstPetHash: string;
  createdAt: string;
};

const USERS_KEY = "acelera-enem-users-v1";

const normalize = (value: string) => value.trim().toLocaleLowerCase("pt-BR");

async function hashSecret(value: string) {
  const bytes = new TextEncoder().encode(normalize(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(input: {
  username: string;
  password: string;
  birthDate: string;
  bestFriend: string;
  firstPet: string;
}) {
  const username = input.username.trim();
  const users = readUsers();
  if (users.some((user) => normalize(user.username) === normalize(username))) {
    throw new Error("Este nome de usuário já está cadastrado.");
  }
  if (username.length < 3)
    throw new Error("O nome de usuário precisa ter pelo menos 3 caracteres.");
  if (input.password.length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  if (!input.birthDate || !input.bestFriend.trim() || !input.firstPet.trim()) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const user: LocalUser = {
    username,
    passwordHash: await hashSecret(input.password),
    birthDate: input.birthDate,
    bestFriendHash: await hashSecret(input.bestFriend),
    firstPetHash: await hashSecret(input.firstPet),
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, user]);
  return user;
}

export async function authenticateUser(username: string, password: string) {
  const user = readUsers().find(
    (candidate) => normalize(candidate.username) === normalize(username),
  );
  if (!user) throw new Error("Usuário não encontrado.");
  if (user.passwordHash !== (await hashSecret(password))) throw new Error("Senha incorreta.");
  return user;
}

export function findUser(username: string) {
  return (
    readUsers().find((candidate) => normalize(candidate.username) === normalize(username)) ?? null
  );
}

export async function resetUserPassword(input: {
  username: string;
  birthDate: string;
  bestFriend: string;
  firstPet: string;
  password: string;
}) {
  const users = readUsers();
  const index = users.findIndex(
    (candidate) => normalize(candidate.username) === normalize(input.username),
  );
  if (index < 0) throw new Error("Usuário não encontrado.");
  const user = users[index]!;
  if (
    user.birthDate !== input.birthDate ||
    user.bestFriendHash !== (await hashSecret(input.bestFriend)) ||
    user.firstPetHash !== (await hashSecret(input.firstPet))
  ) {
    throw new Error("As respostas de recuperação não conferem.");
  }
  if (input.password.length < 6)
    throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");
  users[index] = { ...user, passwordHash: await hashSecret(input.password) };
  writeUsers(users);
}
