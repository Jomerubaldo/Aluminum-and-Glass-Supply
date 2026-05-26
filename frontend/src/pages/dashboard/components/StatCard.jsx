import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value, icon: Icon, className }) => {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-bold text-card-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-card-foreground">{value}</span>
        <span className="text-card-foreground">
          {Icon && <Icon size={36} className={className} />}
        </span>
      </CardContent>
    </Card>
  );
};

export default StatCard;
