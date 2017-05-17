'use strict';

// Regresar una lista de campos como variables de php
exports.fieldToPhpClass = function (data) {
  var resp = {};
  switch (data.resultTarget) {
    case 'variables':
      resp.datos = pullVariables(data.myFields, {
        camel: data.camelCase,
        accessMod: data.accessMod
      });
      break;

    case 'gettersSetters':
      resp.datos = pullGettersSetters(data.myFields, {
        camel: data.camelCase,
        accessMod: data.accessMod
      });
      break;

    case 'convierteArray':
      resp.datos = pullConvierteArray(data.myFields, {
        camel: data.camelCase,
        accessMod: data.accessMod
      });
      break;

    case 'claseCompleta':
      resp.datos = pullClaseCompleta(data.myFields, {
        camel: data.camelCase,
        accessMod: data.accessMod
      });
      break;

    default:
      resp.datos = pullVariables(data.myFields, {
        camel: data.camelCase,
        accessMod: data.accessMod
      });
      break;
  }
  return resp;
};

function splitMyFields(myFields, options) {
  // eliminamos los espacios en blanco de data
  var fields = myFields.replace(/\s/g, '');
  fields = fields.replace(/`/g, '');
  if (options.camel) {
    fields = fields.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
  }
  // separamos cada campo dentro de un array
  return fields.split(',');
}

function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pullVariables(data, options) {
  var classVars = {};
  var chunks = splitMyFields(data, options);
  // por cada uno de los campos, agregamos el modificador de acceso private y $, para transformarlo en una variable de php
  for (var chunk in chunks) {
    if (chunks.hasOwnProperty(chunk)) {
      var element = chunks[chunk];
      classVars[element] = `${options.accessMod} $${element};`;
    }
  }
  return classVars;
}

function pullGettersSetters(data, options) {
  var getset = {};
  var chunks = splitMyFields(data, options);
  getset[0] = `/**
	 * Getters & Setters
	 */`;
  var i = 1;
  for (var key in chunks) {
    if (chunks.hasOwnProperty(key)) {
      var element = chunks[key];
      // formato para el get
      getset[i] = `public function get${upperFirstLetter(element)}() {
          return $this -> ${element};
        }`;
      // formato para el set
      getset[i] += `
        public function set${upperFirstLetter(element)}($${element}) {
          $this -> ${element} = $${element};
        }`;
      i++;
    }
  }
  return getset;
}

function pullConvierteArray(data, options) {
  var convArray = {};
  var chunks = splitMyFields(data, options);
  var length = Object.keys(chunks).length;
  var i = 1;
  convArray[0] = `/**
      * Metodo para convertir un objeto instanciado de esta clase a un arreglo
      */
      public function convierteArray() {
          return array (`;
  for (var key in chunks) {
    if (chunks.hasOwnProperty(key)) {
      var element = chunks[key];
      // formato para la funcion convierteArray
      if (i === length) {
        convArray[i] = `"${element}" => $this -> ${element}`;
      } else {
        convArray[i] = `"${element}" => $this -> ${element},`;
      }
      i++;
    }
  }
  convArray[i + 1] = ');\n}';
  return convArray;
}

function pullClaseCompleta(data, options) {
  var clase = {
    0: pullVariables(data, options),
    1: pullGettersSetters(data, options),
    2: pullConvierteArray(data, options)
  };
  return clase;
}