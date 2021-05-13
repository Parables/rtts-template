import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AppRoutes, IAppRouteProps } from '../../router';

export function SideNav() {
	const sideNavRoutes: Record<string, IAppRouteProps[]> = {};
	let activeMenu = ""

	AppRoutes.slice().filter((route) => (route.navRoute && !route.hidden && route.sectionTitle)).map((route) => {
		if (route.sectionTitle) Array.isArray(sideNavRoutes[route.sectionTitle]) ?
			sideNavRoutes[route.sectionTitle] = [...sideNavRoutes[route.sectionTitle], route] :
			sideNavRoutes[route?.sectionTitle] = [route];
		if (route.navRoute && route.initialActiveMenu && route.label && !route.hidden) activeMenu = route.label
	}); //.sort((a,b)=>{return a.navORder> b.navOrder})

	useEffect(() => {
		document.getElementById(`side-nav-menu-${activeMenu}`)?.click()
	}, [])

	return (
		<>
			<aside className="flex flex-col w-2/12 h-full mr-4 text-white rounded-2xl bg-flame-pea">
				{/* company logo */}
				<img
					src="/assets/logo-stretch.png"
					className="object-contain mx-10 my-5 rounded-full"
				/>

				{Object.keys(sideNavRoutes).map((sectionTitle, i, arr) => {
					return (
						<div key={"side-nav-section-" + i}
							className={`flex flex-col items-center pr-5 mt-10 ${i === arr.length - 1 && ' mb-5'}`}>
							<p className="self-start py-2 ml-10 text-xs font-extrabold uppercase text-gray-50 ">
								{sectionTitle}
							</p>
							{sideNavRoutes[sectionTitle].map((routes, j) => {
								if (routes.navRoute && routes.label && !routes.hidden)
									return <NavMenu key={"side-nav-menu-" + j} {...routes} />;
							})}
						</div>
					);
				})}
			</aside>
		</>
	);
}

function NavMenu({
	path,
	activeClassName,
	navClassName,
	navIcon: NavIcon,
	navIconClass,
	label,
	title,
	description
}: IAppRouteProps) {
	return (
		<dl className="w-full" title={title ?? label ?? ''}>
			<dt className="sr-only">{description ?? label ?? `Click to go to ${path}`}</dt>
			<dd>
				<NavLink
					to={path} id={"side-nav-menu-" + label}
					activeClassName={`bg-white text-flame-pea active-route ${activeClassName ?? ''}`}
					className={`relative flex items-center w-full px-10 py-2 font-semibold rounded-l-none rounded-2xl ${navClassName}`}>
					{NavIcon && <NavIcon className={navIconClass ?? ''} />} {label}
				</NavLink>
			</dd>
		</dl >);
}
