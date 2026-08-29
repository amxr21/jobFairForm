import useLocaleContext from "../../hooks/useLocaleContext";

// Shows the Arabic title when locale is "ar", the English one otherwise.
// Previously both were always rendered stacked (a bilingual-by-default
// design), which predates the language toggle — now that switching locale is
// a real user action, showing both regardless of the chosen language would
// make the toggle pointless for this element.
const Header = () => {
    const { locale } = useLocaleContext();

    return (
        <div data-intro="heading" className="text p-0 md:p-3 w-full flex flex-col gap-2 md:gap-8 items-center">
            {locale === "ar" ? (
                <h2 dir="rtl" lang="ar" className="w-full arabic text-center font-black text-[1.8rem] md:text-5xl">
                    معرض جامعة الشارقة للتدريب و التوظيف
                </h2>
            ) : (
                <h2 dir="ltr" lang="en" className="w-full english text-center font-black text-[1.8rem] md:text-5xl">
                    UoS Internship and Career Fair 2025
                </h2>
            )}
        </div>
    )
}

export default Header
