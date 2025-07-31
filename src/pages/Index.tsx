import { useState, useEffect } from "react";
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
    estimatedDate: "",
    earthSunDistance: 151783917,
    moonOrbits: 0,
    moonPhase: "Quarto Crescente"
  });

  // Velocidade orbital da Terra: ~30 km/s
  const EARTH_ORBITAL_SPEED = 30; // km/s
  const SECONDS_PER_DAY = 86400;
  const GOAL_DISTANCE = 55000000000; // 55 bilhões de km

  useEffect(() => {
    const calculateData = () => {
      const birth = new Date(birthDate);
      const now = new Date();
      const daysSinceBirth = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      
      // Distância total percorrida
      const totalDistance = daysSinceBirth * EARTH_ORBITAL_SPEED * SECONDS_PER_DAY;
      
      // Distância percorrida hoje
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const secondsToday = Math.floor((now.getTime() - startOfDay.getTime()) / 1000);
      const todayDistance = secondsToday * EARTH_ORBITAL_SPEED;
      
      // Distância restante para o objetivo
      const remainingToGoal = Math.max(0, GOAL_DISTANCE - totalDistance);
      
      // Data estimada para atingir o objetivo
      const daysToGoal = remainingToGoal / (EARTH_ORBITAL_SPEED * SECONDS_PER_DAY);
      const estimatedDate = new Date(now.getTime() + daysToGoal * 24 * 60 * 60 * 1000);
      
      // Órbitas da Lua (período orbital: ~27.3 dias)
      const moonOrbits = Math.floor(daysSinceBirth / 27.3);
      
      setCurrentData({
        totalDistance,
        todayDistance,
        remainingToGoal,
        estimatedDate: estimatedDate.toLocaleDateString('pt-BR'),
        earthSunDistance: 151783917,
        moonOrbits,
        moonPhase: getCurrentMoonPhase()
      });
    };

    const getCurrentMoonPhase = () => {
      const phases = ["Nova", "Crescente", "Quarto Crescente", "Gibosa Crescente", 
                     "Cheia", "Gibosa Minguante", "Quarto Minguante", "Minguante"];
      const now = new Date();
      const knownNewMoon = new Date('2024-01-11'); // Data de lua nova conhecida
      const lunarCycle = 29.53; // dias
      const daysSinceKnown = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
      const phaseIndex = Math.floor((daysSinceKnown % lunarCycle) / lunarCycle * 8);
      return phases[phaseIndex];
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
                className="bg-white/20 border-white/30 text-white"
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
            {currentData.totalDistance.toLocaleString('pt-BR')} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            Hoje já percorreu {currentData.todayDistance.toLocaleString('pt-BR')} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            Faltam {currentData.remainingToGoal.toLocaleString('pt-BR')} km para atingir {GOAL_DISTANCE.toLocaleString('pt-BR')} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            📅 Data estimada: {currentData.estimatedDate}
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            📏 Distância aproximada da Terra ao Sol: {currentData.earthSunDistance.toLocaleString('pt-BR')} km
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            🌙 A Lua deu aproximadamente {currentData.moonOrbits} voltas em torno da Terra desde seu nascimento.
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center text-white text-xl">
            🌙 Fase atual da Lua: 🌓 {currentData.moonPhase}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
