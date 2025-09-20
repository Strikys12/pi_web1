package Tasks.usuarioAdministrativo;

public class UsuarioAdministrativo {

    private String usuario;
    private String clave;

    public UsuarioAdministrativo(String usuario, String clave) {
        this.usuario = usuario;
        this.clave = clave;
    }

    public String getusuario() {
        return usuario;
    }
    public void setusuario(String usuario) {
        this.usuario = usuario;
    }

    public String getclave() {
        return clave;
    }

    public void setclave(String clave) {
        this.clave = clave;
    }

    public boolean verificarCredenciales(String usuario, String passString) {
        return this.usuario.equals(usuario) && this.clave.equals(clave);
    }
}