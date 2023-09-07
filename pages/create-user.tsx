import CreateFormUser from './components/createUserComponent';
import Footer from './components/footerComponent';
import Logo from './components/logoComponent';

const CreateUserPage: React.FC = () => {
	return (
		<>
		 <div className="bg-header-img h-screen">
      <div className="mb-10">
        <Logo />
      </div>
      <CreateFormUser />
      <Footer />
    </div>
			
		</>
	)
}

export default CreateUserPage;