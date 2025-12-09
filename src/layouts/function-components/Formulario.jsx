import { useState, useEffect } from 'react';

const Formulario = ({ formAction = '#' }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipo: ''
  });

  const [errors, setErrors] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  // Enviar evento formStart cuando el usuario interactúa con el formulario por primera vez
  useEffect(() => {
    if (!formStarted && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'formStart',
        formName: 'contacto'
      });
      setFormStarted(true);
    }
  }, [formStarted]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre completo es requerido';
        }
        break;
      case 'telefono':
        if (!value.trim()) {
          error = 'El número de teléfono es requerido';
        } else {
          // Remover espacios, guiones y paréntesis para validar solo números
          const phoneDigits = value.replace(/\D/g, '');
          if (phoneDigits.length < 10) {
            error = 'El número debe tener al menos 10 dígitos';
          }
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El correo electrónico es requerido';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Ingresa un correo electrónico válido';
          }
        }
        break;
      case 'tipo':
        if (!value) {
          error = 'Debes seleccionar una opción';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {
      nombre: validateField('nombre', formData.nombre),
      telefono: validateField('telefono', formData.telefono),
      email: validateField('email', formData.email),
      tipo: validateField('tipo', formData.tipo)
    };

    setErrors(newErrors);

    // Verificar si hay errores
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar datos por AJAX
      const response = await fetch(formAction, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Simular respuesta si el endpoint no está disponible
      // En producción, deberías manejar la respuesta real
      if (response.ok || formAction === '#') {
        // Enviar evento formSuccess a Google Tag Manager
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'formSuccess',
            formName: 'contacto',
            formData: {
              tipo: formData.tipo
            }
          });
        }

        setIsSubmitted(true);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
      // En caso de error, aún mostrar éxito si es un endpoint de prueba
      if (formAction === '#') {
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'formSuccess',
            formName: 'contacto',
            formData: {
              tipo: formData.tipo
            }
          });
        }
        setIsSubmitted(true);
      } else {
        alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="form-success-message text-center py-8 px-4">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          ¡Formulario enviado exitosamente!
        </h3>
        <p className="text-gray-600">
          Nos pondremos en contacto contigo pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="formulario-contacto">
      {/* Nombre completo */}
      <div className="mb-5">
        <label htmlFor="nombre" className="form-label">
          Nombre completo
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-control ${errors.nombre ? 'border-red-500' : ''}`}
          placeholder="Ingresa tu nombre completo"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* WhatsApp / Teléfono */}
      <div className="mb-5">
        <label htmlFor="telefono" className="form-label">
          WhatsApp / Número de teléfono
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-control ${errors.telefono ? 'border-red-500' : ''}`}
          placeholder="Ingresa tu número de teléfono"
        />
        {errors.telefono && (
          <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
        )}
      </div>

      {/* Correo electrónico */}
      <div className="mb-5">
        <label htmlFor="email" className="form-label">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-control ${errors.email ? 'border-red-500' : ''}`}
          placeholder="Ingresa tu correo electrónico"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Botón de opción múltiple */}
      <div className="mb-6">
        <label className="form-label mb-3 block">
          ¿Qué necesitas?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, tipo: 'prestamo' }));
              if (errors.tipo) {
                setErrors(prev => ({ ...prev, tipo: '' }));
              }
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              formData.tipo === 'prestamo'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Necesito un préstamo
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, tipo: 'prestar' }));
              if (errors.tipo) {
                setErrors(prev => ({ ...prev, tipo: '' }));
              }
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              formData.tipo === 'prestar'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quiero prestar
          </button>
        </div>
        {errors.tipo && (
          <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full py-3 px-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enviando...
          </span>
        ) : (
          'Enviar'
        )}
      </button>
    </form>
  );
};

export default Formulario;

