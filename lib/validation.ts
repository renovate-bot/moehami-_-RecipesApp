// lib/validation.ts
import { z } from 'zod';

// Validation pour une adresse e-mail
export const emailSchema = z
    .string()
    .min(1, 'L\'adresse e-mail est obligatoire')
    .email('Adresse e-mail invalide');

// Validation pour un mot de passe (ex : minimum 8 caractères, doit inclure un chiffre, une lettre et un caractère spécial)
export const passwordSchema = z
    .string()
    .min(12, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[a-zA-Z]/, 'Le mot de passe doit contenir au moins une lettre')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[\W_]/, 'Le mot de passe doit contenir au moins un caractère spécial');

// Validation pour un nom d'utilisateur (ex : 3-20 caractères alphanumériques)
export const usernameSchema = z
    .string()
    .min(3, 'Le nom d’utilisateur doit contenir au moins 3 caractères')
    .max(20, 'Le nom d’utilisateur ne doit pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d’utilisateur ne peut contenir que des lettres, des chiffres et des underscores');

// Validation pour une URL
export const urlSchema = z
    .string()
    .url('URL invalide')
    .optional();

// Validation pour un numéro de téléphone (ex : 10 chiffres, format français)
export const phoneSchema = z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide')
    .optional();

// Validation pour une date (doit être une date valide)
export const dateSchema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Date invalide');

// Validation pour un champ texte générique (ex : non vide, limite de caractères)
export const textSchema = z
    .string()
    .min(1, 'Ce champ ne peut pas être vide')
    .max(500, 'Ce champ ne peut pas dépasser 500 caractères');

// Validation pour un champ optionnel
export const optionalTextSchema = z
    .string()
    .max(500, 'Ce champ ne peut pas dépasser 500 caractères')
    .optional();

// Validation pour un booléen
export const booleanSchema = z.boolean();

// Validation pour une valeur numérique (ex : âge, avec une valeur minimum et maximum)
export const ageSchema = z
    .number()
    .min(18, 'Vous devez avoir au moins 18 ans')
    .max(120, 'Âge invalide');

// Validation d'un tableau d'éléments (ex : liste de tags)
export const tagsSchema = z
    .array(z.string())
    .nonempty('La liste de tags ne peut pas être vide');

// Exemple de validation combinée pour un formulaire de création de compte
export const signupSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
    }).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

// Exemple de validation pour un formulaire de connexion
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

// Validation pour un formulaire de contact
export const contactSchema = z.object({
    name: textSchema,
    email: emailSchema,
    message: textSchema,
});

// Validation d'un formulaire générique avec plusieurs types de données
export const genericFormSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    phone: phoneSchema,
    website: urlSchema,
    bio: optionalTextSchema,
    birthdate: dateSchema,
    isSubscribed: booleanSchema,
});

export const commentSchema = z
    .string()
    .trim() // Supprimer les espaces inutiles au début et à la fin
    .min(10, 'Le commentaire doit contenir au moins 5 caractères') // Minimum 5 caractères
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères') // Maximum 500 caractères
    .regex(/^[^<>]*$/, 'Le commentaire ne doit pas contenir de balises HTML'); // Pas de balises HTML
