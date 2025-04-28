interface SocialLoginButtonProps {
    bgColor: string
    textColor?: string
    logoSrc: string
    text: string
}

const SocialLoginButton = ({
    bgColor,
    textColor = 'text-black',
    logoSrc,
    text,
}: SocialLoginButtonProps) => {
    return (
        <button
            className={`flex w-96 h-12 px-6 justify-center items-center gap-2.5 ${bgColor} ${textColor} text-lg rounded-lg`}
        >
            <div className="w-24 flex justify-end">
                <img src={logoSrc} alt={`${text} 로고`} className="w-10 h-10" />
            </div>
            <span className="w-28 text-center ml-4 font-bold">{text}</span>
            <div className="w-20"></div>
        </button>
    )
}

export default SocialLoginButton 