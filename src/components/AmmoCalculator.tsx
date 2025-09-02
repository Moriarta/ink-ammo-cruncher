import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface CalculationResults {
  totalAttacks: number;
  attackPenalty: number;
  finalAttackBonus: number;
  hitProbability: number;
}

const AmmoCalculator = () => {
  const [baseAttackRoll, setBaseAttackRoll] = useState<string>("");
  const [additionalModifier, setAdditionalModifier] = useState<string>("0");
  const [hitThreshold, setHitThreshold] = useState<string>("");
  const [damage, setDamage] = useState<string>("");
  const [ammoSpent, setAmmoSpent] = useState<string>("0");
  const [extraAmmo, setExtraAmmo] = useState<string>("0");

  const calculations: CalculationResults = useMemo(() => {
    const baseAttack = parseInt(baseAttackRoll) || 0;
    const modifier = parseInt(additionalModifier) || 0;
    const threshold = parseInt(hitThreshold) || 12;
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
    // Account for natural 1 always missing and natural 20 always hitting
    let hitProbability = 0;
    if (finalAttackBonus + 20 < threshold) {
      hitProbability = 5; // Only natural 20 hits (5%)
    } else if (finalAttackBonus + 1 >= threshold) {
      hitProbability = 95; // Only natural 1 misses (95%)
    } else {
      const neededRoll = threshold - finalAttackBonus;
      hitProbability = ((20 - neededRoll + 1) / 20) * 100;
    }

    return {
      totalAttacks,
      attackPenalty,
      finalAttackBonus,
      hitProbability: Math.round(hitProbability)
    };
  }, [baseAttackRoll, additionalModifier, hitThreshold, ammoSpent, extraAmmo]);

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-ink-border bg-card shadow-lg">
        <CardHeader className="text-center border-b border-ink-border">
          <CardTitle className="text-xl font-bold text-ink-primary">
            TTRPG Ammo Calculator
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Base Attack Roll */}
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="modifier" className="text-sm font-medium text-ink-accent">
              Additional Modifier
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
          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-sm font-medium text-ink-accent">
              Hit Threshold
            </Label>
            <Select value={hitThreshold} onValueChange={setHitThreshold}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Damage */}
          <div className="space-y-2">
            <Label htmlFor="damage" className="text-sm font-medium text-ink-accent">
              Damage
            </Label>
            <Input
              id="damage"
              type="number"
              value={damage}
              onChange={(e) => setDamage(e.target.value)}
              placeholder="Enter damage"
              className="w-full"
              min="1"
            />
          </div>

          {/* Ammo Spent */}
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="extra-ammo" className="text-sm font-medium text-ink-accent">
              Extra Ammo (Penalty Reduction)
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

          <Separator className="my-4 border-ink-border" />

          {/* Results */}
          <div className="space-y-3 p-3 border border-ink-border rounded bg-secondary/50">
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
                <div className="text-ink-secondary">Attack Penalty</div>
                <div className="text-xl font-bold text-destructive">
                  -{calculations.attackPenalty}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-ink-secondary">Final Attack Bonus</div>
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
            </div>

            {damage && (
              <div className="text-center pt-2 border-t border-ink-border">
                <div className="text-ink-secondary text-sm">Expected Damage</div>
                <div className="text-lg font-bold text-ink-accent">
                  {Math.round((calculations.totalAttacks * (calculations.hitProbability / 100) * parseInt(damage || "0")) * 10) / 10}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmmoCalculator;