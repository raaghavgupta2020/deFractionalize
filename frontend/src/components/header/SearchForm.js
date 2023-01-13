import { NavLink } from "react-router-dom";

const SearchForm = () => {
    return (
        <div className="navbar-nav navbar-nav-scroll my-2 my-lg-0">
            {/* <Form onSubmit={e => { e.preventDefault(); }} >
                <input className="form-control" type="text" placeholder="Search" />
                <button className="position-absolute" type="submit">
                    <i className="bi bi-search" />
                </button>
            </Form> */}
            <NavLink to="/dashboard" className="ft-dd" title="Home" id="Home">Dashboard</NavLink>
        </div>
    )
}

export default SearchForm;