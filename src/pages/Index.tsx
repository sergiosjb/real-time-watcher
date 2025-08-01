import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [name, setName] = useState("Sérgio");
  const [birthDate, setBirthDate] = useState("1967-06-18");
  const [currentData, setCurrentData] = useState({
    totalDistance: 0,
    todayDistance: 0,
    remainingToGoal: 0,
    goalDistance: 0,
    estimatedDate: "",
    earthSunDistance: 0,
    moonOrbits: 0,
    moonPhase: "🌑 Nova",
    zodiacSign: ""
  });

  // Constantes baseadas no código de referência
  const ORBITAL_SPEED_KM_PER_SECOND = 107226 / 3600; // 107226 km/h convertido para km/s
  const AVERAGE_DISTANCE_KM = 149597870.7; // Distância média Terra-Sol
  const MOON_ORBITAL_PERIOD_DAYS = 27.321661; // Período orbital da Lua

  const formatKm = (km: number): string => {
    return km.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatBrazilianDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const estimateCurrentDistanceToSun = (): number => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const eccentricity = 0.0167;
    const angleRad = 2 * Math.PI * (dayOfYear / 365.25);
    return AVERAGE_DISTANCE_KM * (1 - eccentricity * Math.cos(angleRad));
  };

  const calculateMoonOrbits = (birthDate: Date): number => {
    const now = new Date();
    const daysSinceBirth = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceBirth / MOON_ORBITAL_PERIOD_DAYS;
  };

  const calculateMoonPhase = (): string => {
    const now = new Date();
    const daysSinceNewMoon = (now.getTime() - new Date("2000-01-06T18:14:00Z").getTime()) / (1000 * 60 * 60 * 24);
    const moonAge = daysSinceNewMoon % 29.530588853;
    
    if (moonAge < 1.84566) return "🌑 Nova";
    else if (moonAge < 5.53699) return "🌒 Crescente";
    else if (moonAge < 9.22831) return "🌓 Quarto Crescente";
    else if (moonAge < 12.91963) return "🌔 Gibosa Crescente";
    else if (moonAge < 16.61096) return "🌕 Cheia";
    else if (moonAge < 20.30228) return "🌖 Gibosa Minguante";
    else if (moonAge < 23.99361) return "🌗 Quarto Minguante";
    else if (moonAge < 27.68493) return "🌘 Minguante";
    else return "🌑 Nova";
  };

  const calculateZodiacSign = (birthDate: Date): string => {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1; // getMonth() retorna 0-11
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈ Áries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉ Touro";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "♊ Gêmeos";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "♋ Câncer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌ Leão";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍ Virgem";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "♎ Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "♏ Escorpião";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "♐ Sagitário";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "♑ Capricórnio";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒ Aquário";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "♓ Peixes";
    
    return "♈ Áries"; // fallback
  };

  useEffect(() => {
    const calculateData = () => {
      const birth = new Date(birthDate + "T08:00:00Z"); // Horário UTC como no código original
      const now = new Date();
      
      // Distância total percorrida
      const secondsSinceBirth = (now.getTime() - birth.getTime()) / 1000;
      const totalDistance = secondsSinceBirth * ORBITAL_SPEED_KM_PER_SECOND;
      
      // Distância percorrida hoje
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const secondsToday = (now.getTime() - startOfDay.getTime()) / 1000;
      const todayDistance = secondsToday * ORBITAL_SPEED_KM_PER_SECOND;
      
      // Cálculo do próximo bilhão (baseado no código original)
      const billion = 1_000_000_000;
      const nextMilestone = Math.ceil(totalDistance / billion) * billion;
      const remainingToGoal = Math.max(0, nextMilestone - totalDistance);
      
      // Data estimada para atingir o próximo bilhão
      const secondsRemaining = remainingToGoal / ORBITAL_SPEED_KM_PER_SECOND;
      const estimatedDate = new Date(now.getTime() + secondsRemaining * 1000);
      
      // Distância atual da Terra ao Sol
      const earthSunDistance = estimateCurrentDistanceToSun();
      
      // Órbitas da Lua desde o nascimento
      const moonOrbits = calculateMoonOrbits(birth);
      
      // Fase atual da Lua
      const moonPhase = calculateMoonPhase();
      
      // Signo zodiacal
      const zodiacSign = calculateZodiacSign(birth);
      
      setCurrentData({
        totalDistance,
        todayDistance,
        remainingToGoal,
        goalDistance: nextMilestone,
        estimatedDate: formatBrazilianDate(estimatedDate),
        earthSunDistance,
        moonOrbits: Math.floor(moonOrbits),
        moonPhase,
        zodiacSign
      });
    };

    calculateData();
    const interval = setInterval(calculateData, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header com inputs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <div>
              <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                max={format(new Date(), "yyyy-MM-dd")}
                min="1900-01-01"
              />
            </div>
          </div>
        </div>

        {/* Título principal */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            🌞 Distância percorrida ao redor do Sol pelo {name} desde {new Date(birthDate).toLocaleDateString('pt-BR')}:
          </h1>
        </div>

        {/* Cards com informações */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl font-semibold">
            {formatKm(currentData.totalDistance)} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            Hoje já percorreu {formatKm(currentData.todayDistance)} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            Faltam {formatKm(currentData.remainingToGoal)} km para atingir {formatKm(currentData.goalDistance)} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            📅 Data estimada: {currentData.estimatedDate}
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            📏 Distância aproximada da Terra ao Sol: {formatKm(currentData.earthSunDistance)} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            🌕 A Lua deu aproximadamente {currentData.moonOrbits} voltas em torno da Terra desde seu nascimento.
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            🌙 Fase atual da Lua: {currentData.moonPhase}
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            ⭐ Signo: {currentData.zodiacSign}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
