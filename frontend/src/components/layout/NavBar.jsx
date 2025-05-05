import { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { LogOut, User } from 'lucide-react';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';

// Define navigation links based on role
const getNavLinks = (isAuthenticated, role) => {
  console.log('isAuthenticated:', isAuthenticated);
  console.log('role:', role);
  const baseLinks = [
    { name: 'Home', path: '/' },
  ];

  if (!isAuthenticated) {
    return [
      ...baseLinks,
      { name: 'Find Tutors', path: '/find-tutors' },
      { name: 'Become a Tutor', path: '/become-tutor' },
    ];
  }

  const roleBasedLinks = {
    student: [
      ...baseLinks,
      { name: 'Find Tutors', path: '/find-tutors' },
      { name: 'My Sessions', path: '/sessions' }, // Updated to /sessions
    ],
    tutor: [
      ...baseLinks,
      { name: 'My Sessions', path: '/sessions' }, // Updated to /sessions
      
    ],
    admin: [
      ...baseLinks,
      { name: 'Manage Users', path: '/manage-users' },
      { name: 'Manage Sessions', path: '/manage-sessions' },
    ],
  };

  return roleBasedLinks[role] || baseLinks; // Fallback for unexpected roles
};

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get auth state from Redux store
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;

  const navLinks = getNavLinks(isAuthenticated, user?.role);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex gap-4 items-center">
            <img src={logo1} alt="Logo 1" className="h-14 w-auto" />
            <img src={logo2} alt="Logo 2" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Nav */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold hover:text-teal-700 ${
                isActive(link.path) ? 'text-teal-700' : 'text-gray-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {/* {isAuthenticated && user?.role === 'student' && (
            <Link
              to="/become-tutor"
              className={`text-sm font-semibold hover:text-teal-700 ${
                isActive('/become-tutor') ? 'text-teal-700' : 'text-gray-900'
              }`}
            >
              Become a Tutor
            </Link>
          )} */}
        </PopoverGroup>

        {/* Auth Section Desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
              </div>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-gray-900 hover:text-teal-700"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-sm font-semibold text-gray-900 hover:text-teal-700"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-gray-900 hover:text-red-500"
              >
                <LogOut className="inline h-4 w-4 mr-1" />
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm px-4 py-1.5 font-semibold text-gray-900 hover:text-teal-700">
                Log in
              </Link>
              <Link
                to="/signup"
                className="ml-4 rounded-md bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 flex gap-4 items-center" onClick={() => setMobileMenuOpen(false)}>
              <img src={logo1} alt="Logo 1" className="h-10 w-auto" />
              <img src={logo2} alt="Logo 2" className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50 ${
                      isActive(link.path) ? 'text-teal-700' : 'text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* {isAuthenticated && user?.role === 'student' && (
                  <Link
                    to="/become-tutor"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50 ${
                      isActive('/become-tutor') ? 'text-teal-700' : 'text-gray-900'
                    }`}
                  >
                    Become a Tutor
                  </Link>
                )} */}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      <LogOut className="inline h-4 w-4 mr-1" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 mt-2 block rounded-lg bg-teal-700 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-teal-700"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}