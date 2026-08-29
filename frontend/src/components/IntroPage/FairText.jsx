import useLocaleContext from "../../hooks/useLocaleContext";

// Switches between the Arabic copy and its English equivalent based on
// locale, matching Header.jsx. Previously always rendered the Arabic
// sentence regardless of locale, predating the language toggle.
const FairText = () => {
    const { locale } = useLocaleContext();
    const isArabic = locale === "ar";

    return (
        <div
            data-intro="heading"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            className={`text text-justify md:text-start text-[.9rem] md:text-[1.5rem]`}
        >
            <p>
                {isArabic
                    ? "التقِ بأفضل جهات التوظيف، واكتشف فرصًا واعدة، وابنِ علاقات مهنية قيّمة – وكل ذلك في بيئة خالية من الورق"
                    : "Meet top employers, discover promising opportunities, and build valuable professional connections — all in a paperless environment"}
            </p>
        </div>
    )
}

export default FairText
