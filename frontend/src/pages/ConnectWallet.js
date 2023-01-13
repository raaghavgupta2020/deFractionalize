import Header from "../components/header/Header";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import Divider from "../components/divider/Divider";
import ConnectWalletContent from "../components/connetWallet/ConnetWalletContent";

const ConnectWallet = () => {
    return (
        <>
            <Header />

            <Breadcrumb
                breadcrumbTitle="Connect Wallet"
                breadcrumbNav={[
                    {
                        navText: "Home",
                        path: "/"
                    }
                ]}
            />

            <Divider />

            <ConnectWalletContent />


        </>
    )
}

export default ConnectWallet;