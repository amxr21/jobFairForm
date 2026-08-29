import { Input, SelectInput, Languages } from "./index";
import StepContainer from "./StepContainer";
import { CountriesList } from "../../CountriesList";


const PersonalInfo = () => {

    return (
        <StepContainer id="PersonalInfo">
            <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3 md:gap-y-4">
                    {/* Row 1: Name and ID */}
                    <Input fieldClasses="col-span-6 md:col-span-4" label={"First Name"} />
                    <Input fieldClasses="col-span-6 md:col-span-4" label={"Last Name"} />
                    <Input fieldClasses="col-span-12 md:col-span-4" label={"University ID"} />

                    {/* Row 2: Personal Details — full width on mobile.
                        At col-span-6 on a 360px screen these were ~165px wide,
                        which truncated longer values ("Ras Al-Khaima", most
                        nationalities). Vertical scrolling is cheaper than a
                        label the user can't read. Gender keeps its half-row:
                        "Male"/"Female" fit comfortably. */}
                    <Input fieldClasses="col-span-6 md:col-span-3" label={"Date of Birth"} />
                    <SelectInput fieldClasses="col-span-6 md:col-span-3" label={"Gender"} options={["Male", "Female"]} />
                    <SelectInput fieldClasses="col-span-12 md:col-span-3" label={"City"} options={["Ajman", "Sharjah", "Dubai", "Abu Dhabi", "Fujairah", "Ras Al-Khaima", "Um Al-Quwain"]} />
                    <SelectInput fieldClasses="col-span-12 md:col-span-3" label={"Nationality"} options={CountriesList} />

                    {/* Row 3: Contact Info */}
                    <Input fieldClasses="col-span-12 md:col-span-4" label={"Email address"} />
                    <Input fieldClasses="col-span-12 md:col-span-4" label={'Mobile number'} />
                    <Input label={"LinkedIn URL"} type={"text"} fieldClasses="col-span-12 md:col-span-4" />

                {/* Row 4: Languages */}
                <Languages classes="col-span-12"/>
            </div>
        </StepContainer>
    )
}



export default PersonalInfo;
