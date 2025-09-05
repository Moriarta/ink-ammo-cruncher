import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";


interface CalculationResults {
  totalAttacks: number;
  attackPenalty: number;
  finalAttackBonus: number;
  hitProbability: number;
}

const AmmoCalculator = () => {
  const [baseAttackRoll, setBaseAttackRoll] = useState("6");
  const [additionalModifier, setAdditionalModifier] = useState<string>("0");
  const [hitThreshold, setHitThreshold] = useState("14");
  const [damage, setDamage] = useState(5);
  const [ammoSpent, setAmmoSpent] = useState<string>("0");
  const [extraAmmo, setExtraAmmo] = useState<string>("0");

  const calculations: CalculationResults = useMemo(() => {
    const baseAttack = parseInt(baseAttackRoll) || 0;
    const modifier = parseInt(additionalModifier) || 0;
    const threshold = parseInt(hitThreshold) || 0;
    const ammo = parseInt(ammoSpent) || 0;
    const extra = parseInt(extraAmmo) || 0;

    // Calculate attacks and penalties
    const totalAttacks = 1 + ammo; // Original attack + extra attacks from ammo
    const rawPenalty = ammo * 2; // -2 per ammo spent
    const penaltyReduction = Math.min(extra, rawPenalty); // Each extra ammo reduces penalty by 1
    const attackPenalty = rawPenalty - penaltyReduction;
    
    // Calculate final attack bonus
    const finalAttackBonus = baseAttack + modifier - attackPenalty;
    
    // Calculate hit probability (need to roll >= threshold on d20)
    let hitProbability = 0;
    const neededRoll = threshold - finalAttackBonus;
    if (neededRoll <= 1) {
      // Any roll will succeed
      hitProbability = 100;
    } else if (neededRoll > 20) {
      // No roll can succeed
      hitProbability = 0;
    } else {
      // Probability is number of successful rolls / 20
      hitProbability = ((21 - neededRoll) / 20) * 100;
    }

    return {
      totalAttacks,
      attackPenalty,
      finalAttackBonus,
      hitProbability: Math.round(hitProbability)
    };
  }, [baseAttackRoll, additionalModifier, hitThreshold, ammoSpent, extraAmmo]);

  return (
    <div className="min-h-[100svh] h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-ink-border bg-card shadow-lg">
        <CardHeader className="text-center border-b border-ink-border">
          <CardTitle className="text-xl font-bold text-ink-primary">
            Marksman Ammo Calculator
          </CardTitle>
        </CardHeader>
        
        <CardContent className="grid grid-cols-2 auto-rows-fr gap-4 p-4">
          {/* Base Attack Roll */}
          <div className="flex flex-col space-y-2 justify-between">
            <Label htmlFor="base-attack" className="text-sm font-medium text-ink-accent">
              Base Attack Roll
            </Label>
            <Select value={baseAttackRoll} onValueChange={setBaseAttackRoll}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select base attack" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 21 }, (_, i) => i).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    +{num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Modifier */}
          <div className="flex flex-col space-y-2 justify-between">
            <Label htmlFor="modifier" className="text-sm font-medium text-ink-accent">
              Ext. Modifier
            </Label>
            <Select value={additionalModifier} onValueChange={setAdditionalModifier}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select modifier" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => i - 5).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num >= 0 ? '+' : ''}{num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hit Threshold */}
          <div className="flex flex-col space-y-2 justify-between">
            <Label htmlFor="threshold" className="text-sm font-medium text-ink-accent">
              Hit Threshold
            </Label>
            <Select value={hitThreshold} onValueChange={setHitThreshold}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Damage */}
          <div className="flex flex-col space-y-2 justify-between">
            <Label htmlFor="damage" className="text-sm font-medium text-ink-accent">
              Damage
            </Label>
            <Input
              id="damage"
              type="number"
              value={damage}
              onChange={(e) => setDamage(Number(e.target.value))}
              placeholder="Enter damage"
              className="w-full"
              min="1"
            />
          </div>

          {/* Ammo Spent */}
          <div className="flex flex-col space-y-2 justify-between">
            <Label htmlFor="ammo-spent" className="text-sm font-medium text-ink-accent">
              Ammo Spent
            </Label>
            <Select value={ammoSpent} onValueChange={setAmmoSpent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ammo" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => i).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Extra Ammo for Penalty Reduction */}
          <div className="flex flex-col space-y-2 justify-between">
            <Label htmlFor="extra-ammo" className="text-sm font-medium text-ink-accent">
              Precise Shots
            </Label>
            <Select value={extraAmmo} onValueChange={setExtraAmmo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select extra ammo" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => i).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </CardContent>
          <div className="border-t border-ink-border my-4" />

          {/* Results */}
          <CardContent className="space-y-3 p-3 border border-ink-border rounded bg-secondary/50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-ink-primary mb-3">Results</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="text-ink-secondary">Total Attacks</div>
                <div className="text-xl font-bold text-ink-primary">
                  {calculations.totalAttacks}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-ink-secondary">Final Attack Roll</div>
                <div className="text-xl font-bold text-ink-accent">
                  {calculations.finalAttackBonus >= 0 ? '+' : ''}{calculations.finalAttackBonus}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-ink-secondary">Hit Probability</div>
                <div className="text-xl font-bold text-ink-primary">
                  {calculations.hitProbability}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-ink-secondary">Expected Damage</div>
                <div className="text-xl font-bold text-ink-accent">
                  {damage ? Math.round((calculations.totalAttacks * (calculations.hitProbability / 100) * parseInt(damage || "0")) * 10) / 10 : 0}
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmmoCalculator;
