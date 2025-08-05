import Logo from 'assets/images/auth-logo.png';

function AuthOverlay() {
  return (
    <section className='h-screen text-[#919193] items-center font-mont relative'>
      <div className='relative top-[27%] max-w-[700px]'>
        <div className='ms-12'>
          <img src={Logo} alt='logo' />
        </div>
        <p className='ms-20 text-lg opacity-0'>
          Lorem ipsum dolor sit amet consectetur. Sed vestibulum bibendum iaculis volutpat semper nibh a volutpat felis.
        </p>
      </div>
      <p className='absolute bottom-8 left-20 font-medium text-black'>
        © 2024 Cultivating Growth . All Rights Reserved
      </p>
    </section>
  );
}

export default AuthOverlay;
