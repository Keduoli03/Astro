import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: {
		name: i18n(I18nKey.home),
		url: "/",
		icon: "material-symbols:home-outline-rounded",
	},
	[LinkPreset.About]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:person-outline",
	},
	[LinkPreset.Archive]: {
		name: i18n(I18nKey.archive),
		url: "/archive/",
		icon: "material-symbols:archive-outline",
	},
	[LinkPreset.Friends]: {
		name: i18n(I18nKey.friends),
		url: "/friends/",
		icon: "material-symbols:group-outline",
	},
	[LinkPreset.Series]: {
		name: i18n(I18nKey.series),
		url: "/series/",
		icon: "material-symbols:library-books-outline",
	},
	[LinkPreset.ChronoBox]: {
		name: i18n(I18nKey.chronobox),
		url: "/chronobox/",
		icon: "material-symbols:schedule",
	},
};
