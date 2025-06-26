import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { AddUsers } from "./admin"

const userSchema = z.object({
  username: z.string().min(1, "Le nom est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["ROLE_ADMIN", "ROLE_GESTIONNAIRE", "ROLE_CLIENT"], {
    required_error: "Le rôle est requis",
  }),
})

type UserFormData = z.infer<typeof userSchema>

interface NewUserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
}

const ROLES = [
  { value: "ROLE_ADMIN", label: "Administrateur" },
  { value: "ROLE_GESTIONNAIRE", label: "Gestionnaire" },
  { value: "ROLE_CLIENT", label: "Client" },
]

export function NewUserForm({ open, onOpenChange, onUserCreated }: NewUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)

    try {
      console.log("New user data:", data)
      await AddUsers(data);
      toast.success("L'utilisateur a été créé avec succès")
      reset()
      onOpenChange(false)
      onUserCreated()
    } catch (error) {
      toast.error("Impossible de créer l'utilisateur")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur *</Label>
            <Input id="username" {...register("username")} placeholder="Nom d'utilisateur" />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} placeholder="email@exemple.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input id="password" type="password" {...register("password")} placeholder="Mot de passe" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <Select onValueChange={(value) => setValue("role", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer l'utilisateur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 