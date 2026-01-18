import Link from 'next/link';

const Footer = () => {
    return (<>
        <footer className="bg-zinc-950 text-white py-12 border-t border-zinc-800">
            <div className=" px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
                            Learning & Development
                        </h3>
                        <p className="text-zinc-400 max-w-sm">
                            Empowering our team with the skills and knowledge needed to excel in branch operations.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-zinc-400">
                            <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                            <li><Link href="/catalog" className="hover:text-teal-400 transition-colors">Catalog</Link></li>
                            <li><Link href="/#pathways" className="hover:text-teal-400 transition-colors">Pathways</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact</h4>
                        <p className="text-zinc-400">
                            For support or inquiries, please contact the Learning & Development team.
                        </p>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                    &copy; {new Date().getFullYear()} Branch Ops Learning Portal. All rights reserved.
                </div>
            </div>
        </footer></>
    );
};

export default Footer;
