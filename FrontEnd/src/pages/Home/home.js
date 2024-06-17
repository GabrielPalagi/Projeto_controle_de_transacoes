import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer';
import imagemHome from './imagemHome.jpg';

function Home() {

    return (
        <>
            <Header />
            <div className="home-container">
                <h1>Controle De Finanças Pessoal</h1>
                <img src={imagemHome} alt="Controle De Finanças Pessoal"/>

            </div>
            <Footer />
        </>
    );
}

export default Home;