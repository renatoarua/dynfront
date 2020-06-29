export const CHART_DESC: any[] = [
  {
    name: 'line',
    title: 'Static Line',
    text: "The static line is a graphic tool to analyze displacements due to static forces applied to system (distributed mass of the rotor). The user can find 4 important information in this graphic: translational displacements of the center of shaft cross sections, angular/rotational displacements of shaft cross sections, force and moment reactions in bearings, and bearings positions."
  },
  {
    name: 'campbell',
    title: 'Campbell Diagram',
    text: "The Campbell diagram helps the user to identify critical speeds of rotating machinery. In the diagram the user is able to detect the variation of natural frequencies – colored lines - along to spin speed. The crossing of colored lines with the black lines will determine the critical speeds.\nThe diagram of real part presents the plot of eigenvalues' real part, along the spin speed. The colors of the lines match the colored lines (natural frequencies) of Campbell diagram. Thus, the user is able to verify the stability of the rotor bearing system in its natural frequencies."
  },
  {
    name: 'stiffness',
    title: 'Critical Map (Stiffness)',
    text: "The stiffness map is a 3D diagram which presents the variation of natural frequency in realtion to a bearing stiffness and spin speed. The surfaces are the natural frequencies."
  },
  {
    name: 'modes',
    title: 'Modes Analisys',
    text: "The vibrational modes are the plot of the orthonormalized eigenvectors of system. This graphic tool shows the vibrational shape of the machine in a spin speed that matches a critical speed. The displacements should not be interpreted as real displacements, other calculations are intended to satisfy this demand."
  },
  {
    name: 'unbalance',
    title: 'Unbalance Response',
    text: "The unbalance response chart shows the vibration amplitude response peak to peak in a previously shaft position center set, in terms of displacement, due to unbalance force. This chart also presents the phase which helps to identify critical speeds. Both amplitude and phase are plot in function of spin speed."
  },
  {
    name: 'constant',
    title: 'Constant Response',
    text: "The constant speed response graph shows the vibration amplitude response peak to peak in a previously shaft position center set, in terms of displacement, due to a harmonic external force. This chart also presents the phase which helps to identify resonances. Both amplitude and phase are plot in function of frequency in a constant spin speed."
  },
  {
    name: 'time',
    title: 'Time Response',
    text: "The time response presents a few numbers of charts presenting the movement of precession of shaft center. An animation along the range of spin speed present the precession variation of the whole shaft. One other graphic present the precession of the whole shaft in an instant spin speed. The graph of a specific position of the shaft in an instant spin speed is also available in this set of time response results. All calculations consider a permanent regime which neglects the transient."
  },
  {
    name: 'torsional',
    title: 'Torsional Analisys',
    text: "The torsional response chart shows the vibration amplitude response peak to peak in a previously shaft position set, in terms of angle, due to a harmonic moment. This chart also presents the phase which helps to identify resonances.\nThe torsional modes present a set of graphics that shows the torsional vibrational shape in a frequency that matches a natural frequency."
  }
];
