interface SocialLoginButtonProps {
    bgColor: string
    textColor?: string
    logoComponent: React.ReactNode
    text: string
}

const SocialLoginButton = ({
    bgColor,
    textColor = 'text-black',
    logoComponent,
    text,
}: SocialLoginButtonProps) => {
    return (
        <button
            className={`flex w-96 h-12 px-6 justify-center items-center gap-2.5 ${bgColor} ${textColor} text-lg rounded-lg`}
        >
            <div className="w-24 flex justify-end">
                {logoComponent}
            </div>
            <span className="w-28 text-center ml-4 font-bold">{text}</span>
            <div className="w-20"></div>
        </button>
    )
}

export default SocialLoginButton 