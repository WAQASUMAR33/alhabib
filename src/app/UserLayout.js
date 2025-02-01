import Footer from "./components/Footer";
import Header from "./components/Header";

export default function UserLayout({children}){
    return (
       <div className="w-full h-full">
        <Header/>
        <div className="mt-16">
         {children}
         <Footer/>
         </div>
         </div>
    )
}