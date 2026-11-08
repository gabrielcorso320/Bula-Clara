import type {ReactNode} from 'react';
import './globals.css';
export const metadata = {title:'BulaClara — Entenda sua bula com facilidade',description:'Leitura acessível de imagens de bulas. Consulte, compare e escute sem cadastro obrigatório.'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
