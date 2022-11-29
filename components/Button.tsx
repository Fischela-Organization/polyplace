import { CSSProperties, MouseEventHandler } from "react";

interface ButtonInterface{
  btnName: string, classStyles: string, handleClick?: any, btnType?: any, isLoading?: boolean, style: CSSProperties
}

const Button = ({ style, btnName, classStyles, handleClick, isLoading }: ButtonInterface) => (
  <button
    type="button"
    style={style}
    className={`nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white transform transition duration-500 hover:scale-105 ${classStyles}`}
    onClick={handleClick}
  >
    {isLoading ?"loading..." : btnName}
  </button>
);

export default Button;
