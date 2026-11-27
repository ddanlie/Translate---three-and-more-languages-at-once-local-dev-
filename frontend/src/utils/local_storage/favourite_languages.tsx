export type LanguageIdentity = {
  languageCode: string;
  countryCode: string | null | undefined;
};

export type FavouriteLanguage = LanguageIdentity & {
  /** ISO date the language was favourited. Empty for entries saved before dates were tracked. */
  addedAt: string;
};

const FAVOURITE_LANGUAGES_KEY = "favourite_languages";

const isSameLanguage = (a: LanguageIdentity, b: LanguageIdentity): boolean =>
  a.languageCode === b.languageCode && a.countryCode === b.countryCode;

export const getFavouriteLanguages = (): FavouriteLanguage[] => {
  try {
    const raw = localStorage.getItem(FAVOURITE_LANGUAGES_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is LanguageIdentity & { addedAt?: unknown } =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as LanguageIdentity).languageCode === "string" &&
          typeof (item as LanguageIdentity).countryCode === "string"
      )
      .map((item) => ({
        languageCode: item.languageCode,
        countryCode: item.countryCode,
        addedAt: typeof item.addedAt === "string" ? item.addedAt : "",
      }));
  } catch {
    return [];
  }
};

const setFavouriteLanguages = (favourites: FavouriteLanguage[]): void => {
  try {
    localStorage.setItem(FAVOURITE_LANGUAGES_KEY, JSON.stringify(favourites));
  } catch {
    // Storage full or unavailable - callers still get the updated list.
  }
};

export const addFavouriteLanguage = (
  languageCode: string,
  countryCode: string
): FavouriteLanguage[] => {
  const favourites = getFavouriteLanguages();

  if (!languageCode) return favourites;

  const alreadySaved = favourites.some((item) =>
    isSameLanguage(item, { languageCode, countryCode })
  );
  if (alreadySaved) return favourites;

  const updated = [
    ...favourites,
    { languageCode, countryCode, addedAt: new Date().toISOString() },
  ];
  setFavouriteLanguages(updated);
  return updated;
};

export const removeFavouriteLanguage = (
  languageCode: string,
  countryCode: string
): FavouriteLanguage[] => {
  const updated = getFavouriteLanguages().filter(
    (item) => !isSameLanguage(item, { languageCode, countryCode })
  );
  setFavouriteLanguages(updated);
  return updated;
};

export const isFavouriteLanguage = (
  languageCode: string,
  countryCode: string
): boolean =>
  getFavouriteLanguages().some((item) =>
    isSameLanguage(item, { languageCode, countryCode })
  );


