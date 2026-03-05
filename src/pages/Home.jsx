import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVulnerabilities, getLabs, getPlatformStats } from '../services/authService';

function Home() {
  const [labs, setLabs] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        try {
          const labsData = await getLabs();
          setLabs(Array.isArray(labsData) ? labsData : []);
        } catch {}

        try {
          const vulnData = await getVulnerabilities();
          setVulnerabilities(Array.isArray(vulnData) ? vulnData : []);
        } catch {}

        try {
          const statsData = await getPlatformStats();
          setStats(statsData);
        } catch {}

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Plateforme intelligente de <br />
            détection et gestion des vulnérabilités
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Sécurisez vos systèmes. Anticipez les menaces. Protégez vos données.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/login" className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
              Se connecter
            </Link>
            <Link to="/register" className="px-6 py-3 border border-green-500 text-green-600 rounded-lg shadow hover:bg-green-100 transition">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 max-w-4xl mx-auto px-6 text-center">
        <p className="text-gray-700 text-lg">
          Notre plateforme vous aide à détecter, analyser et gérer les vulnérabilités de sécurité dans vos systèmes informatiques.
        </p>
      </section>

      {/* Features Grid */}
      <section className="py-12 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Détection des vulnérabilités', desc: 'Analyse automatisée des failles', icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="2"/>
              <path d="M24 8v32M8 24h32" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )},
          { title: 'Rapports & Statistiques', desc: 'Données et rapports détaillés', icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="10" width="8" height="28" fill="#10b981" opacity="0.7"/>
              <rect x="20" y="6" width="8" height="32" fill="#10b981" opacity="0.9"/>
              <rect x="32" y="14" width="8" height="24" fill="#10b981" opacity="0.6"/>
            </svg>
          )},
          { title: 'Gestion des Alertes', desc: 'Alertes en temps réel', icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 6c7.7 0 14 6.3 14 14v8c0 1.1.9 2 2 2h2v4h-2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h-36v-4h2c1.1 0 2-.9 2-2v-4c0-1.1.9-2 2-2h-2v-4h2c1.1 0 2-.9 2-2v-8c0-7.7 6.3-14 14-14z" fill="#10b981"/>
              <circle cx="24" cy="20" r="4" fill="white"/>
            </svg>
          )},
          { title: 'Gestion des Utilisateurs', desc: 'Admin & Utilisateurs', icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="18" cy="16" r="8" stroke="#10b981" strokeWidth="2"/>
              <path d="M6 38c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="34" cy="16" r="8" stroke="#10b981" strokeWidth="2"/>
              <path d="M24 38c0-5 3.6-9.2 8.4-10.2" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )},
        ].map((f, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6 text-center">
            <div className="mb-4 flex justify-center">{f.icon}</div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Statistics Section */}
      {stats && (
        <section className="py-12 bg-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8">Statistiques de la Plateforme</h2>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Utilisateurs', value: stats.totalUsers || 0 },
              { label: 'Vulnérabilités', value: stats.totalVulnerabilities || 0 },
              { label: 'Laboratoires', value: stats.totalLabs || 0 },
              { label: 'Utilisateurs Actifs', value: stats.activeUsers || 0 },
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6 text-center">
                <h3 className="text-2xl font-bold mb-2">{s.value}</h3>
                <p className="text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

     
      {labs.length > 0 && (
        <section className="py-12 max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Laboratoires de Sécurité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <div key={lab._id} className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6">
                <h3 className="font-semibold mb-2">{lab.titre || lab.name || 'Lab'}</h3>
                <p className="text-gray-600 mb-2">{lab.description || 'Lab de sécurité'}</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm mb-2">{lab.niveau || lab.difficulty || 'Intermédiaire'}</span>
                <Link to={`/lab/${lab._id}`} className="inline-block text-green-600 hover:underline">Accéder au Lab</Link>
              </div>
            ))}
          </div>
        </section>
      )}

     
      {vulnerabilities.length > 0 && (
        <section className="py-12 max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Vulnérabilités Découvertes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vulnerabilities.slice(0,5).map((vuln) => (
              <div key={vuln._id} className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6">
                <h4 className="font-semibold mb-2">{vuln.titre || vuln.name}</h4>
                <p className="text-gray-600 mb-2">{vuln.description || 'Vulnérabilité de sécurité'}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  (vuln.severite || vuln.severity || 'medium').toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                  (vuln.severite || vuln.severity || 'medium').toLowerCase() === 'low' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {vuln.severite || vuln.severity || 'Moyen'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
{/* For Whom Section */}
<section className="py-12 max-w-6xl mx-auto px-6">
  <h2 className="text-2xl font-bold text-center mb-8">Pour qui ?</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Développeurs */}
    <div className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6 text-center">
      <div className="mb-4">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto">
          <circle cx="40" cy="25" r="12" fill="#10b981"/>
          <path d="M20 50c0-11 8.95-20 20-20s20 9 20 20v20H20z" fill="#10b981" opacity="0.8"/>
          <rect x="50" y="40" width="20" height="15" fill="#10b981" opacity="0.6" rx="2"/>
          <rect x="52" y="42" width="3" height="11" fill="white" rx="1"/>
          <rect x="58" y="42" width="3" height="11" fill="white" rx="1"/>
          <rect x="64" y="42" width="3" height="11" fill="white" rx="1"/>
        </svg>
      </div>
      <h3 className="font-semibold mb-2">Développeurs</h3>
      <p className="text-gray-600">Intégrez la sécurité dès le développement</p>
    </div>

    {/* Administrateurs systèmes */}
    <div className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6 text-center">
      <div className="mb-4">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto">
          <rect x="15" y="20" width="50" height="40" rx="4" stroke="#10b981" strokeWidth="2" fill="none"/>
          <circle cx="28" cy="35" r="3" fill="#10b981"/>
          <circle cx="40" cy="35" r="3" fill="#10b981"/>
          <circle cx="52" cy="35" r="3" fill="#10b981"/>
          <line x1="20" y1="50" x2="60" y2="50" stroke="#10b981" strokeWidth="1.5"/>
          <circle cx="25" cy="60" r="4" fill="#10b981" opacity="0.7"/>
          <circle cx="55" cy="60" r="4" fill="#10b981" opacity="0.7"/>
        </svg>
      </div>
      <h3 className="font-semibold mb-2">Administrateurs systèmes</h3>
      <p className="text-gray-600">Maintenez une infrastructure sécurisée</p>
    </div>

    {/* Équipes de sécurité */}
    <div className="bg-white p-6 rounded-lg shadow-md fade-in transform opacity-0 translate-y-6 text-center">
      <div className="mb-4">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto">
          <path d="M20 45L40 20L60 45L55 65H25Z" fill="#10b981" opacity="0.8"/>
          <rect x="30" y="50" width="20" height="15" fill="#10b981" opacity="0.9" rx="2"/>
          <circle cx="37" cy="57" r="2" fill="white"/>
          <circle cx="43" cy="57" r="2" fill="white"/>
        </svg>
      </div>
      <h3 className="font-semibold mb-2">Équipes de sécurité</h3>
      <p className="text-gray-600">Gérez les vulnérabilités efficacement</p>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-gray-200 text-center">
        <p>&copy; 2024 - Plateforme de Gestion des Vulnérabilités</p>
        <p>Plateforme académique de test et d'apprentissage en sécurité informatique</p>
      </footer>
    </div>
  );
}

export default Home;