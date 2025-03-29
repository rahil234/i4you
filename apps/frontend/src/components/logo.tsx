import logo from "../../public/i4you-logo_white.png"
import Image from 'next/image'

export function Logo() {
    return <Image src={logo} alt="logo" width="20" height="20"/>
}

export default Logo
