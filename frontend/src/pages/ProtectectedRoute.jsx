const ProtectedRoute = ({ allowedRoles, reverse = false }) => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
  
    useEffect(() => {
      if (!user && !loading) {
        dispatch(checkAuth());
      }
    }, [dispatch, user, loading]);
  
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
  
    // For reverse protection (login/signup pages)
    if (reverse && user) {
      return <Navigate to="/dashboard" replace />;
    }
  
    // For normal protection
    if (!reverse) {
      if (!user) {
        return <Navigate to="/login" replace />;
      }
  
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  
    return <Outlet />;
  };