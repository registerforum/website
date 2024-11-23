import Image from 'next/image';
import "@/styles/Header.module.css";

export default function Header() {
    return (
        <header>
            <Image
                src="/rf-banner.svg"
                alt="logo"
                className="image"
                width={900}
                height={100}
                loading="eager"
            />
        </header>
    );
}